import { cleanString } from "./api-core.js";

export const GOOGLE_SUBJECT_INDEX_NAME = "googleSubject_1";
export const GOOGLE_SUBJECT_PARTIAL_FILTER = { googleSubject: { $type: "string" } };

export async function setupUserIndexes(users) {
  await users.createIndex({ installId: 1 }, { unique: true });
  await users.updateMany({ googleSubject: "" }, { $unset: { googleSubject: "" } });

  const indexes = await users.listIndexes().toArray();
  const googleSubjectIndex = indexes.find((index) => index.name === GOOGLE_SUBJECT_INDEX_NAME);
  const existingPartialFilter = JSON.stringify(
    googleSubjectIndex?.partialFilterExpression || null,
  );
  const desiredPartialFilter = JSON.stringify(GOOGLE_SUBJECT_PARTIAL_FILTER);

  if (
    googleSubjectIndex &&
    (
      googleSubjectIndex.sparse ||
      !googleSubjectIndex.unique ||
      existingPartialFilter !== desiredPartialFilter
    )
  ) {
    try {
      await users.dropIndex(GOOGLE_SUBJECT_INDEX_NAME);
    } catch (err) {
      if (err.codeName !== "IndexNotFound") throw err;
    }
  }

  await users.createIndex(
    { googleSubject: 1 },
    {
      unique: true,
      partialFilterExpression: GOOGLE_SUBJECT_PARTIAL_FILTER,
    },
  );
}

export function normalizeSessionInput(body, identity) {
  const provider = cleanString(body.provider || "local", 32) === "google"
    ? "google"
    : "local";

  return {
    provider,
    displayName: cleanString(body.displayName, 120),
    email: cleanString(body.email, 160).toLowerCase(),
    googleSubject: "",
    googleIdToken: cleanString(body.googleIdToken, 4096) || identity.bearerToken,
  };
}

export function applyVerifiedGoogleSession(session, verified) {
  return {
    ...session,
    provider: "google",
    displayName: verified.displayName || session.displayName,
    email: (verified.email || session.email).toLowerCase(),
    googleSubject: verified.googleSubject || "",
  };
}

export function buildUserUpdate(session, identity, now) {
  const $set = {
    provider: session.provider,
    displayName: session.displayName,
    email: session.email,
    hasBearerToken: Boolean(identity.bearerToken || session.googleIdToken),
    lastSeenAt: now,
    updatedAt: now,
  };

  if (session.googleSubject) {
    $set.googleSubject = session.googleSubject;
  }

  const update = {
    $set,
    $addToSet: {
      installIds: identity.installId,
    },
    $setOnInsert: {
      installId: identity.installId,
      createdAt: now,
    },
  };

  if (!session.googleSubject) {
    update.$unset = { googleSubject: "" };
  }

  return update;
}

export async function resolveUserFilter(users, session, identity) {
  if (!session.googleSubject) {
    return { installId: identity.installId };
  }

  const existingGoogleUser = await users.findOne(
    { googleSubject: session.googleSubject },
    { projection: { _id: 1, installId: 1 } },
  );

  if (!existingGoogleUser) {
    return { installId: identity.installId };
  }

  if (existingGoogleUser.installId !== identity.installId) {
    await users.deleteOne({
      installId: identity.installId,
      googleSubject: { $exists: false },
    });
  }

  return { _id: existingGoogleUser._id };
}

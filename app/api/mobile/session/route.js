import { getDatabase } from "../../../../lib/mongodb";
import { jsonError, jsonOk, readIdentity, readJson } from "../../../../lib/api";
import { verifyGoogleIdToken } from "../../../../lib/google-auth";
import {
  applyVerifiedGoogleSession,
  buildUserUpdate,
  normalizeSessionInput,
  resolveUserFilter,
  setupUserIndexes,
} from "../../../../lib/session.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let userIndexesPromise;

function ensureUserIndexes(users) {
  if (!userIndexesPromise) {
    userIndexesPromise = setupUserIndexes(users).catch((err) => {
      userIndexesPromise = null;
      throw err;
    });
  }
  return userIndexesPromise;
}

export async function POST(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  const body = (await readJson(request)) || {};
  const now = new Date();
  let session = normalizeSessionInput(body, identity);

  if (session.provider === "google" || session.googleIdToken) {
    try {
      session = applyVerifiedGoogleSession(
        session,
        await verifyGoogleIdToken(session.googleIdToken),
      );
    } catch (err) {
      return jsonError(err.message || "Google sign-in failed.", err.status || 401);
    }
  }

  try {
    const database = await getDatabase();
    const users = database.collection("users");
    await ensureUserIndexes(users);
    const userFilter = await resolveUserFilter(users, session, identity);
    const update = buildUserUpdate(session, identity, now);

    const result = await users.findOneAndUpdate(
      userFilter,
      update,
      {
        upsert: true,
        returnDocument: "after",
        projection: {
          _id: 0,
          installId: 1,
          provider: 1,
          displayName: 1,
          email: 1,
          googleSubject: 1,
          installIds: 1,
          createdAt: 1,
          updatedAt: 1,
          lastSeenAt: 1,
        },
      },
    );

    return jsonOk({ user: result });
  } catch (err) {
    return jsonError("Unable to save session.", 503, { detail: err.message });
  }
}

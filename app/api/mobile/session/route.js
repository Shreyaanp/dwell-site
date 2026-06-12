import { getDatabase } from "../../../../lib/mongodb";
import { cleanString, jsonError, jsonOk, readIdentity, readJson } from "../../../../lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  const body = (await readJson(request)) || {};
  const now = new Date();
  const provider = cleanString(body.provider || "local", 32) || "local";
  const displayName = cleanString(body.displayName, 120);
  const email = cleanString(body.email, 160).toLowerCase();
  const googleSubject = cleanString(body.googleSubject, 128);

  try {
    const database = await getDatabase();
    const users = database.collection("users");
    await users.createIndex({ installId: 1 }, { unique: true });
    await users.createIndex({ googleSubject: 1 }, { sparse: true });

    const update = {
      $set: {
        provider,
        displayName,
        email,
        googleSubject,
        hasBearerToken: Boolean(identity.bearerToken),
        lastSeenAt: now,
        updatedAt: now,
      },
      $setOnInsert: {
        installId: identity.installId,
        createdAt: now,
      },
    };

    const result = await users.findOneAndUpdate(
      { installId: identity.installId },
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

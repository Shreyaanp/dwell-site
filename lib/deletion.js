import crypto from "node:crypto";

export const DELETION_RETENTION_DAYS = 30;

export function hashIdentifier(value) {
  if (!value) return "";
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export async function deleteInstallData(database, installId, { deleteAccount = false } = {}) {
  const deletedAt = new Date();
  const [zones, events, user] = await Promise.all([
    database.collection("zones").deleteMany({ installId }),
    database.collection("events").deleteMany({ installId }),
    deleteAccount
      ? database.collection("users").deleteOne({ installId })
      : database.collection("users").updateOne(
          { installId },
          {
            $set: {
              dataDeletedAt: deletedAt,
              updatedAt: deletedAt,
            },
          },
        ),
  ]);

  return {
    zonesDeleted: zones.deletedCount,
    eventsDeleted: events.deletedCount,
    accountDeleted: deleteAccount ? user.deletedCount : 0,
  };
}

export async function recordDeletionRequest(
  database,
  {
    source,
    requestType,
    installId = "",
    email = "",
    message = "",
    status = "received",
    result = null,
  },
) {
  const requestedAt = new Date();
  const expiresAt = new Date(
    requestedAt.getTime() + DELETION_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
  const requests = database.collection("deletion_requests");
  await requests.createIndex({ requestedAt: -1 });
  await requests.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await requests.insertOne({
    source,
    requestType,
    installIdHash: hashIdentifier(installId),
    email: email.trim().toLowerCase(),
    message: message.trim().slice(0, 1000),
    status,
    result,
    requestedAt,
    expiresAt,
  });
}

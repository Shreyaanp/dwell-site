import crypto from "node:crypto";
import {
  linkedInstallIds,
  userFilterForInstall,
} from "./ownership.js";

export const DELETION_RETENTION_DAYS = 30;

export function hashIdentifier(value) {
  if (!value) return "";
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export async function deleteInstallData(database, installId, { deleteAccount = false } = {}) {
  const deletedAt = new Date();
  const users = database.collection("users");
  const userFilter = userFilterForInstall(installId);
  const userDoc = deleteAccount
    ? await users.findOne(userFilter, { projection: { installId: 1, installIds: 1 } })
    : null;
  const installIds = deleteAccount ? linkedInstallIds(userDoc, installId) : [installId];
  const dataFilter = installIds.length === 1
    ? { installId }
    : { installId: { $in: installIds } };

  const [zones, events, userResult] = await Promise.all([
    database.collection("zones").deleteMany(dataFilter),
    database.collection("events").deleteMany(dataFilter),
    deleteAccount
      ? users.deleteOne(userFilter)
      : users.updateOne(
          userFilter,
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
    accountDeleted: deleteAccount ? userResult.deletedCount : 0,
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

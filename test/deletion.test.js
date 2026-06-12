import assert from "node:assert/strict";
import test from "node:test";
import {
  DELETION_RETENTION_DAYS,
  deleteInstallData,
  hashIdentifier,
  recordDeletionRequest,
} from "../lib/deletion.js";

function createMockDatabase({ userDoc = null } = {}) {
  const collections = new Map();

  function collection(name) {
    if (!collections.has(name)) {
      const calls = [];
      collections.set(name, {
        calls,
        deleteMany: async (filter) => {
          calls.push(["deleteMany", filter]);
          return { deletedCount: name === "zones" ? 2 : 3 };
        },
        deleteOne: async (filter) => {
          calls.push(["deleteOne", filter]);
          return { deletedCount: 1 };
        },
        findOne: async (filter, options) => {
          calls.push(["findOne", filter, options]);
          return userDoc;
        },
        updateOne: async (filter, update) => {
          calls.push(["updateOne", filter, update]);
          return { matchedCount: 1, modifiedCount: 1 };
        },
        createIndex: async (...args) => {
          calls.push(["createIndex", ...args]);
          return "index";
        },
        insertOne: async (doc) => {
          calls.push(["insertOne", doc]);
          return { insertedId: "request-id" };
        },
      });
    }
    return collections.get(name);
  }

  return {
    collection,
    callsFor(name) {
      return collections.get(name)?.calls || [];
    },
  };
}

test("deleteInstallData removes zones/events but keeps account for data deletion", async () => {
  const database = createMockDatabase();
  const result = await deleteInstallData(database, "install-123", {
    deleteAccount: false,
  });

  assert.deepEqual(result, {
    zonesDeleted: 2,
    eventsDeleted: 3,
    accountDeleted: 0,
  });
  assert.deepEqual(database.callsFor("zones")[0], [
    "deleteMany",
    { installId: "install-123" },
  ]);
  assert.deepEqual(database.callsFor("events")[0], [
    "deleteMany",
    { installId: "install-123" },
  ]);
  assert.deepEqual(database.callsFor("users")[0][0], "updateOne");
  assert.deepEqual(database.callsFor("users")[0][1], {
    $or: [
      { installId: "install-123" },
      { installIds: "install-123" },
    ],
  });
  assert.ok(database.callsFor("users")[0][2].$set.dataDeletedAt instanceof Date);
});

test("deleteInstallData deletes linked account for account deletion", async () => {
  const database = createMockDatabase({
    userDoc: {
      installId: "install-primary",
      installIds: ["install-456", "install-secondary"],
    },
  });
  const result = await deleteInstallData(database, "install-456", {
    deleteAccount: true,
  });

  assert.equal(result.accountDeleted, 1);
  assert.deepEqual(database.callsFor("zones")[0], [
    "deleteMany",
    {
      installId: {
        $in: ["install-456", "install-primary", "install-secondary"],
      },
    },
  ]);
  assert.deepEqual(database.callsFor("events")[0], [
    "deleteMany",
    {
      installId: {
        $in: ["install-456", "install-primary", "install-secondary"],
      },
    },
  ]);
  assert.deepEqual(database.callsFor("users")[0], [
    "findOne",
    {
      $or: [
        { installId: "install-456" },
        { installIds: "install-456" },
      ],
    },
    { projection: { installId: 1, installIds: 1 } },
  ]);
  assert.deepEqual(database.callsFor("users")[1], [
    "deleteOne",
    {
      $or: [
        { installId: "install-456" },
        { installIds: "install-456" },
      ],
    },
  ]);
});

test("recordDeletionRequest stores hashed install id and expiry metadata", async () => {
  const database = createMockDatabase();
  await recordDeletionRequest(database, {
    source: "mobile_api",
    requestType: "delete_account",
    installId: "install-secret",
    email: " USER@Example.COM ",
    message: "x".repeat(1100),
    status: "completed",
    result: { accountDeleted: 1 },
  });

  const deletionCalls = database.callsFor("deletion_requests");
  assert.deepEqual(deletionCalls[0], ["createIndex", { requestedAt: -1 }]);
  assert.deepEqual(deletionCalls[1], [
    "createIndex",
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
  ]);

  const inserted = deletionCalls[2][1];
  assert.equal(inserted.installIdHash, hashIdentifier("install-secret"));
  assert.notEqual(inserted.installIdHash, "install-secret");
  assert.equal(inserted.email, "user@example.com");
  assert.equal(inserted.message.length, 1000);
  assert.equal(inserted.status, "completed");
  assert.deepEqual(inserted.result, { accountDeleted: 1 });

  const retentionMs = inserted.expiresAt.getTime() - inserted.requestedAt.getTime();
  assert.equal(retentionMs, DELETION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
});

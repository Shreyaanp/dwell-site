import assert from "node:assert/strict";
import test from "node:test";
import {
  applyVerifiedGoogleSession,
  buildUserUpdate,
  GOOGLE_SUBJECT_INDEX_NAME,
  GOOGLE_SUBJECT_PARTIAL_FILTER,
  normalizeSessionInput,
  resolveUserFilter,
  setupUserIndexes,
} from "../lib/session.js";

const identity = {
  installId: "install-abc123",
  bearerToken: null,
};

test("normalizeSessionInput treats unknown providers as local and bounds fields", () => {
  const session = normalizeSessionInput(
    {
      provider: "surprise",
      displayName: " A ".repeat(100),
      email: " USER@Example.COM ",
      googleSubject: "client-must-not-control-this",
    },
    identity,
  );

  assert.equal(session.provider, "local");
  assert.equal(session.displayName.length, 120);
  assert.equal(session.email, "user@example.com");
  assert.equal(session.googleSubject, "");
  assert.equal(session.googleIdToken, null);
});

test("applyVerifiedGoogleSession trusts verified token claims over client body", () => {
  const local = normalizeSessionInput(
    {
      provider: "google",
      displayName: "Client Name",
      email: "client@example.com",
      googleIdToken: "token",
    },
    identity,
  );
  const verified = applyVerifiedGoogleSession(local, {
    displayName: "Verified Name",
    email: "Verified@Example.COM",
    googleSubject: "google-subject",
  });

  assert.equal(verified.provider, "google");
  assert.equal(verified.displayName, "Verified Name");
  assert.equal(verified.email, "verified@example.com");
  assert.equal(verified.googleSubject, "google-subject");
});

test("buildUserUpdate unsets googleSubject for local sessions", () => {
  const now = new Date("2026-06-12T00:00:00.000Z");
  const session = normalizeSessionInput(
    {
      provider: "local",
      displayName: "Local User",
      email: "local@example.com",
    },
    identity,
  );

  assert.deepEqual(buildUserUpdate(session, identity, now), {
    $set: {
      provider: "local",
      displayName: "Local User",
      email: "local@example.com",
      hasBearerToken: false,
      lastSeenAt: now,
      updatedAt: now,
    },
    $addToSet: {
      installIds: "install-abc123",
    },
    $setOnInsert: {
      installId: "install-abc123",
      createdAt: now,
    },
    $unset: {
      googleSubject: "",
    },
  });
});

test("buildUserUpdate stores verified google subject and token state", () => {
  const now = new Date("2026-06-12T00:00:00.000Z");
  const session = applyVerifiedGoogleSession(
    normalizeSessionInput(
      {
        provider: "google",
        googleIdToken: "id-token",
      },
      identity,
    ),
    {
      displayName: "Google User",
      email: "google@example.com",
      googleSubject: "google-subject",
    },
  );

  const update = buildUserUpdate(session, identity, now);
  assert.equal(update.$set.provider, "google");
  assert.equal(update.$set.googleSubject, "google-subject");
  assert.equal(update.$set.hasBearerToken, true);
  assert.equal(update.$unset, undefined);
});

test("resolveUserFilter uses install id when no google subject exists", async () => {
  const calls = [];
  const users = {
    findOne: async (...args) => {
      calls.push(["findOne", ...args]);
      return null;
    },
  };

  const filter = await resolveUserFilter(
    users,
    { googleSubject: "" },
    identity,
  );

  assert.deepEqual(filter, { installId: "install-abc123" });
  assert.deepEqual(calls, []);
});

test("resolveUserFilter links to existing google account and removes local placeholder", async () => {
  const calls = [];
  const users = {
    findOne: async (...args) => {
      calls.push(["findOne", ...args]);
      return { _id: "user-id", installId: "old-install" };
    },
    deleteOne: async (...args) => {
      calls.push(["deleteOne", ...args]);
      return { deletedCount: 1 };
    },
  };

  const filter = await resolveUserFilter(
    users,
    { googleSubject: "google-subject" },
    identity,
  );

  assert.deepEqual(filter, { _id: "user-id" });
  assert.deepEqual(calls, [
    [
      "findOne",
      { googleSubject: "google-subject" },
      { projection: { _id: 1, installId: 1 } },
    ],
    [
      "deleteOne",
      {
        installId: "install-abc123",
        googleSubject: { $exists: false },
      },
    ],
  ]);
});

test("setupUserIndexes replaces sparse googleSubject index with partial unique index", async () => {
  const calls = [];
  const users = {
    createIndex: async (...args) => {
      calls.push(["createIndex", ...args]);
    },
    updateMany: async (...args) => {
      calls.push(["updateMany", ...args]);
    },
    listIndexes: () => ({
      toArray: async () => [
        {
          name: GOOGLE_SUBJECT_INDEX_NAME,
          sparse: true,
          unique: false,
        },
      ],
    }),
    dropIndex: async (...args) => {
      calls.push(["dropIndex", ...args]);
    },
  };

  await setupUserIndexes(users);

  assert.deepEqual(calls, [
    ["createIndex", { installId: 1 }, { unique: true }],
    ["updateMany", { googleSubject: "" }, { $unset: { googleSubject: "" } }],
    ["dropIndex", GOOGLE_SUBJECT_INDEX_NAME],
    [
      "createIndex",
      { googleSubject: 1 },
      {
        unique: true,
        partialFilterExpression: GOOGLE_SUBJECT_PARTIAL_FILTER,
      },
    ],
  ]);
});

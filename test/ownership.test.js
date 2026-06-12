import assert from "node:assert/strict";
import test from "node:test";
import {
  linkedInstallIds,
  resolveLinkedInstallScope,
  userFilterForInstall,
} from "../lib/ownership.js";

test("userFilterForInstall matches primary and linked install ids", () => {
  assert.deepEqual(userFilterForInstall("install-1"), {
    $or: [
      { installId: "install-1" },
      { installIds: "install-1" },
    ],
  });
});

test("linkedInstallIds includes current, primary, and linked ids without duplicates", () => {
  assert.deepEqual(
    linkedInstallIds(
      {
        installId: "primary",
        installIds: ["current", "secondary", "primary"],
      },
      "current",
    ),
    ["current", "primary", "secondary"],
  );
});

test("resolveLinkedInstallScope returns account-wide filter when user is linked", async () => {
  const calls = [];
  const database = {
    collection(name) {
      assert.equal(name, "users");
      return {
        findOne: async (...args) => {
          calls.push(args);
          return {
            installId: "primary",
            installIds: ["current", "secondary"],
          };
        },
      };
    },
  };

  const scope = await resolveLinkedInstallScope(database, "current");

  assert.deepEqual(calls[0], [
    {
      $or: [
        { installId: "current" },
        { installIds: "current" },
      ],
    },
    { projection: { installId: 1, installIds: 1 } },
  ]);
  assert.deepEqual(scope, {
    canonicalInstallId: "primary",
    dataFilter: { installId: { $in: ["current", "primary", "secondary"] } },
    installIds: ["current", "primary", "secondary"],
  });
});

test("resolveLinkedInstallScope falls back to current install for local users", async () => {
  const database = {
    collection() {
      return {
        findOne: async () => null,
      };
    },
  };

  assert.deepEqual(await resolveLinkedInstallScope(database, "local-install"), {
    canonicalInstallId: "local-install",
    dataFilter: { installId: "local-install" },
    installIds: ["local-install"],
  });
});

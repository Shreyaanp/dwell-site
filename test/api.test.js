import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanString,
  dateFromClient,
  numberInRange,
  parseIdentityHeaders,
} from "../lib/api-core.js";
import { mobileConfigFromEnv } from "../lib/mobile-config.js";

function requestWithHeaders(headers) {
  return new Request("https://dwell.example/api/mobile/session", { headers }).headers;
}

test("readIdentity accepts install id and bearer token", () => {
  const { identity, error } = parseIdentityHeaders(
    requestWithHeaders({
      "x-dwell-install-id": " install-12345 ",
      authorization: "Bearer token-abc",
    }),
  );

  assert.equal(error, undefined);
  assert.deepEqual(identity, {
    installId: "install-12345",
    bearerToken: "token-abc",
  });
});

test("readIdentity rejects missing or invalid install id", async () => {
  const { identity, error } = parseIdentityHeaders(requestWithHeaders({}));

  assert.equal(identity, undefined);
  assert.deepEqual(error, {
    message: "Missing or invalid X-Dwell-Install-Id header.",
    status: 401,
  });
});

test("api input cleaners bound user controlled values", () => {
  assert.equal(cleanString("  abc  ", 2), "ab");
  assert.equal(cleanString(123, 2), "");
  assert.equal(numberInRange("42", 1, 60), 42);
  assert.equal(numberInRange("99", 1, 60), null);
  assert.equal(numberInRange("nope", 1, 60), null);
});

test("dateFromClient falls back for invalid timestamps", () => {
  const parsed = dateFromClient("2026-06-12T00:00:00.000Z");
  assert.equal(parsed.toISOString(), "2026-06-12T00:00:00.000Z");

  const before = Date.now();
  const fallback = dateFromClient("not a date");
  const after = Date.now();
  assert.ok(fallback.getTime() >= before);
  assert.ok(fallback.getTime() <= after);
});

test("mobile config exposes a switchable non-autocomplete search provider", () => {
  const config = mobileConfigFromEnv({
    DWELL_MAP_STYLE_URL: "https://maps.example.test/styles/liberty/",
    DWELL_MAP_ATTRIBUTION_LABEL: "Example Maps | OpenStreetMap",
    DWELL_SEARCH_BASE_URL: "https://search.example.test/",
    DWELL_SEARCH_USER_AGENT: "DwellTest/1.2 (+https://example.test)",
  });

  assert.deepEqual(config, {
    map: {
      provider: "maplibre",
      styleUrl: "https://maps.example.test/styles/liberty",
      attributionLabel: "Example Maps | OpenStreetMap",
    },
    search: {
      provider: "nominatim",
      baseUrl: "https://search.example.test",
      userAgent: "DwellTest/1.2 (+https://example.test)",
      autocomplete: false,
      minQueryLength: 3,
      networkCooldownMs: 1500,
      cacheTtlMs: 1800000,
    },
  });
});

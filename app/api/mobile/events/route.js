import { getDatabase } from "../../../../lib/mongodb";
import { cleanString, dateFromClient, jsonError, jsonOk, readIdentity, readJson } from "../../../../lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_PROPERTIES = 30;

function cleanProperties(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const entries = Object.entries(value).slice(0, MAX_PROPERTIES);
  return Object.fromEntries(
    entries.map(([key, raw]) => {
      const cleanKey = cleanString(key, 64);
      if (!cleanKey) return null;
      if (typeof raw === "number" || typeof raw === "boolean") return [cleanKey, raw];
      if (raw == null) return [cleanKey, null];
      return [cleanKey, cleanString(String(raw), 240)];
    }).filter(Boolean),
  );
}

export async function POST(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  const body = (await readJson(request)) || {};
  const type = cleanString(body.type, 80);
  if (!type) return jsonError("Missing event type.", 400);

  const now = new Date();
  const event = {
    installId: identity.installId,
    type,
    properties: cleanProperties(body.properties),
    clientTimestamp: dateFromClient(body.timestamp),
    createdAt: now,
  };

  try {
    const database = await getDatabase();
    const events = database.collection("events");
    await events.createIndex({ installId: 1, createdAt: -1 });
    await events.createIndex({ type: 1, createdAt: -1 });
    await events.insertOne(event);

    return jsonOk();
  } catch (err) {
    return jsonError("Unable to save event.", 503, { detail: err.message });
  }
}

import { getDatabase } from "../../../../lib/mongodb";
import {
  cleanString,
  jsonError,
  jsonOk,
  numberInRange,
  readIdentity,
  readJson,
} from "../../../../lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRIMARY_ZONE_ID = "primary";

async function zonesCollection() {
  const database = await getDatabase();
  const zones = database.collection("zones");
  await zones.createIndex({ installId: 1, zoneId: 1 }, { unique: true });
  await zones.createIndex({ installId: 1, updatedAt: -1 });
  return zones;
}

export async function GET(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  try {
    const zones = await zonesCollection();
    const items = await zones
      .find(
        { installId: identity.installId },
        {
          projection: {
            _id: 0,
            installId: 0,
          },
          sort: { updatedAt: -1 },
          limit: 20,
        },
      )
      .toArray();

    return jsonOk({ zones: items });
  } catch (err) {
    return jsonError("Unable to load zones.", 503, { detail: err.message });
  }
}

export async function PUT(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  const body = (await readJson(request)) || {};
  const label = cleanString(body.label || "Primary zone", 160) || "Primary zone";
  const lat = numberInRange(body.lat, -90, 90);
  const lon = numberInRange(body.lon, -180, 180);
  const radiusMeters = numberInRange(body.radiusMeters, 25, 5000);
  const durationMinutes = numberInRange(body.durationMinutes, 1, 2880);
  const armed = Boolean(body.armed);

  if (lat == null || lon == null || radiusMeters == null || durationMinutes == null) {
    return jsonError("Invalid zone payload.", 400);
  }

  const now = new Date();

  try {
    const zones = await zonesCollection();
    const result = await zones.findOneAndUpdate(
      {
        installId: identity.installId,
        zoneId: PRIMARY_ZONE_ID,
      },
      {
        $set: {
          zoneId: PRIMARY_ZONE_ID,
          label,
          lat,
          lon,
          radiusMeters,
          durationMinutes: Math.round(durationMinutes),
          armed,
          updatedAt: now,
        },
        $setOnInsert: {
          installId: identity.installId,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: {
          _id: 0,
          installId: 0,
        },
      },
    );

    return jsonOk({ zone: result });
  } catch (err) {
    return jsonError("Unable to save zone.", 503, { detail: err.message });
  }
}

export async function DELETE(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  try {
    const zones = await zonesCollection();
    await zones.deleteOne({
      installId: identity.installId,
      zoneId: PRIMARY_ZONE_ID,
    });

    return jsonOk();
  } catch (err) {
    return jsonError("Unable to delete zone.", 503, { detail: err.message });
  }
}

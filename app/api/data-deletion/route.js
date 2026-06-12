import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { cleanString, jsonError, jsonOk, readJson } from "../../../lib/api";
import { recordDeletionRequest } from "../../../lib/deletion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function readPayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await readJson(request)) || {};
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request) {
  const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");
  const payload = await readPayload(request);
  const requestType = cleanString(payload.requestType, 40);
  const email = cleanString(payload.email, 160);
  const installId = cleanString(payload.installId, 128);
  const message = cleanString(payload.message, 1000);

  if (!["delete_data", "delete_account"].includes(requestType)) {
    return jsonError("Choose whether you want to delete app data or delete your account.", 400);
  }

  if (!email && !installId) {
    return jsonError("Add an email address or app install ID so we can identify the request.", 400);
  }

  try {
    const database = await getDatabase();
    await recordDeletionRequest(database, {
      source: "web",
      requestType,
      installId,
      email,
      message,
      status: "received",
    });

    if (acceptsHtml) {
      return NextResponse.redirect(new URL("/data-deletion?submitted=1", request.url), 303);
    }

    return jsonOk({
      status: "received",
      retentionDays: 30,
    });
  } catch (err) {
    return jsonError("Unable to receive deletion request.", 503, { detail: err.message });
  }
}

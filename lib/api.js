import { NextResponse } from "next/server";

export function jsonOk(body = {}, init = {}) {
  return NextResponse.json({ ok: true, ...body }, init);
}

export function jsonError(message, status = 400, extra = {}) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      ...extra,
    },
    { status },
  );
}

export function readIdentity(request) {
  const installId = request.headers.get("x-dwell-install-id")?.trim();
  const authorization = request.headers.get("authorization")?.trim();

  if (!installId || installId.length < 8 || installId.length > 128) {
    return {
      error: jsonError("Missing or invalid X-Dwell-Install-Id header.", 401),
    };
  }

  return {
    identity: {
      installId,
      bearerToken: authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : null,
    },
  };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function cleanString(value, maxLength = 240) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function numberInRange(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return number;
}

export function dateFromClient(value) {
  if (typeof value !== "string") return new Date();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
}

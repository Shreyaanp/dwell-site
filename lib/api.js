import { NextResponse } from "next/server";
import {
  cleanString,
  dateFromClient,
  numberInRange,
  parseIdentityHeaders,
} from "./api-core";

export { cleanString, dateFromClient, numberInRange };

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
  const { identity, error } = parseIdentityHeaders(request.headers);
  if (error) {
    return {
      error: jsonError(error.message, error.status),
    };
  }

  return { identity };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

import { jsonOk } from "../../../../lib/api";
import { mobileConfigFromEnv } from "../../../../lib/mobile-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return jsonOk(mobileConfigFromEnv());
}

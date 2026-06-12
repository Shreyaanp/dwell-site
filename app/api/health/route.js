import { NextResponse } from "next/server";
import { getDatabase, hasMongoConfig } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!hasMongoConfig()) {
    return NextResponse.json({
      ok: true,
      service: "dwell-site",
      database: {
        configured: false,
        status: "missing_env",
      },
    });
  }

  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      service: "dwell-site",
      database: {
        configured: true,
        status: "connected",
        name: database.databaseName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "dwell-site",
        database: {
          configured: true,
          status: "error",
        },
        error: error.message,
      },
      { status: 503 },
    );
  }
}

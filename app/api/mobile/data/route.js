import { getDatabase } from "../../../../lib/mongodb";
import { jsonError, jsonOk, readIdentity } from "../../../../lib/api";
import { deleteInstallData, recordDeletionRequest } from "../../../../lib/deletion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request) {
  const { identity, error } = readIdentity(request);
  if (error) return error;

  try {
    const database = await getDatabase();
    const result = await deleteInstallData(database, identity.installId, {
      deleteAccount: false,
    });
    await recordDeletionRequest(database, {
      source: "mobile_api",
      requestType: "delete_data",
      installId: identity.installId,
      status: "completed",
      result,
    });

    return jsonOk({
      deleted: result,
      kept: ["account/session record"],
    });
  } catch (err) {
    return jsonError("Unable to delete app data.", 503, { detail: err.message });
  }
}

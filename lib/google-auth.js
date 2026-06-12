import { OAuth2Client } from "google-auth-library";

let googleClient;

function authError(message, status = 401) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getGoogleClient() {
  if (!googleClient) {
    googleClient = new OAuth2Client();
  }
  return googleClient;
}

export async function verifyGoogleIdToken(idToken) {
  const audience =
    process.env.GOOGLE_SERVER_CLIENT_ID?.trim() ||
    process.env.GOOGLE_WEB_CLIENT_ID?.trim();
  if (!audience) {
    throw authError("Google auth is not configured.", 503);
  }
  if (!idToken || typeof idToken !== "string") {
    throw authError("Missing Google ID token.");
  }

  try {
    const ticket = await getGoogleClient().verifyIdToken({
      idToken,
      audience,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub) {
      throw authError("Google ID token is missing a subject.");
    }

    return {
      googleSubject: payload.sub,
      email: payload.email || "",
      displayName: payload.name || "",
    };
  } catch (error) {
    if (error.status) throw error;
    throw authError("Invalid Google ID token.");
  }
}

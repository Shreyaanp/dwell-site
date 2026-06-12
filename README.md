# dwell-site

Next.js site and backend for [Dwell](https://github.com/Shreyaanp/maps), the
geofence-timer app for Android + Wear OS. Hosted on Vercel at
https://dwell.shreyaan.work.

## Routes

- `/` - landing page
- `/privacy` - privacy policy linked from the Google Play listing
- `/data-deletion` - public data/account deletion request page for Google Play
- `/api/data-deletion` - public deletion request intake
- `/api/health` - backend health check with optional MongoDB ping
- `/api/mobile/data` - delete app data while keeping account/session (`DELETE`)
- `/api/mobile/account` - delete account/session and associated app data (`DELETE`)
- `/api/mobile/session` - app session/user upsert
- `/api/mobile/zones` - saved primary geofence zone (`GET`, `PUT`, `DELETE`)
- `/api/mobile/events` - lightweight analytics event ingestion

Mobile API requests should include:

```bash
X-Dwell-Install-Id: <stable app install id>
```

For Google sign-in, the Android app sends the Credential Manager ID token to
`/api/mobile/session` as `googleIdToken`. The backend verifies that token and
links all installs on the same Google account; `/api/mobile/zones` loads and
updates the primary zone across those linked installs.

## Development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and add MongoDB access when available:

```bash
MONGODB_URI=mongodb+srv://...
MONGODB_DB=dwell
GOOGLE_SERVER_CLIENT_ID=<server-oauth-client-id>.apps.googleusercontent.com
```

For Google sign-in, keep both OAuth clients in the same Google Cloud project:

- Android client: package `work.shreyaan.dwell` plus the app signing SHA-1.
- Server client: its client ID goes in `GOOGLE_SERVER_CLIENT_ID` for this backend and the Android app's `local.properties`. Google Cloud may show this as an OAuth client of type "Web application"; it is used as the backend audience for ID-token verification, not as a web login flow.

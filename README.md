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
Authorization: Bearer <google id token> # optional until auth verification is wired
```

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
```

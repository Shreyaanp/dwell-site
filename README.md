# dwell-site

Next.js site and backend for [Dwell](https://github.com/Shreyaanp/maps), the
geofence-timer app for Android + Wear OS. Hosted on Vercel at
https://dwell.shreyaan.work.

## Routes

- `/` - landing page
- `/privacy` - privacy policy linked from the Google Play listing
- `/api/health` - backend health check with optional MongoDB ping

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

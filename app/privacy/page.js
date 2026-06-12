import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name} on Android and Wear OS.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `${site.name} Privacy Policy`,
    description: `Privacy policy for ${site.name} on Android and Wear OS.`,
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-content">
        <Link className="back-link" href="/">
          Back to Dwell
        </Link>
        <h1>Privacy Policy</h1>
        <p className="meta">Dwell for Android and Wear OS · Effective June 12, 2026</p>

        <p>
          Dwell is a timer app that starts a countdown when your phone detects you have arrived at a
          place you chose on a map. This policy describes what data the app uses and what happens to
          it. Dwell can be used with a local session or Google sign-in, and may sync saved zone and
          product analytics data to Dwell's backend so the app can support account features and
          diagnostics.
        </p>

        <h2>Location</h2>
        <p>
          Dwell uses your device's <strong>precise location</strong> for detecting when you enter or
          leave the area you selected on the map. Geofence monitoring is performed on your device by
          Android's Google Play services. Dwell asks for "Allow all the time" location access so this
          detection works while the app is closed.
        </p>
        <ul>
          <li>Your current live GPS position is used by the app to center the map and evaluate the geofence.</li>
          <li>
            If you save a zone, Dwell may store the selected place coordinates, radius, timer
            duration, and armed status on Dwell's backend.
          </li>
          <li>You can delete saved app data or delete your account from the app settings.</li>
        </ul>

        <h2>Account and analytics data</h2>
        <p>
          Dwell may store a local app install ID, account/session details, saved geofence zones, and
          lightweight analytics events such as app opened, location searched, geofence armed, timer
          started, and timer cancelled. These events help us understand whether the product flow is
          working. Dwell does not sell personal data or use advertising SDKs.
        </p>

        <h2>Map tiles</h2>
        <p>
          The map you see is loaded from{" "}
          <a href="https://operations.osmfoundation.org/policies/tiles/">
            OpenStreetMap's public tile servers
          </a>
          . Like any web request, fetching map imagery shares your IP address and the coordinates of
          the map area you are viewing with those servers, subject to the OpenStreetMap Foundation's
          privacy policy. Map areas you have viewed are cached on your device so repeat views need no
          network at all.
        </p>

        <h2>Watch synchronization</h2>
        <p>
          If you use the Dwell watch app, timer state (the countdown end time) is sent from your
          phone to your paired watch through Google's on-device Wear OS Data Layer. It travels
          between your own devices and nowhere else.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>No selling personal data</li>
          <li>No advertising SDKs</li>
          <li>No selling or sharing of data with third parties</li>
          <li>No upload of continuous/live location tracks</li>
        </ul>

        <h2>Data deletion</h2>
        <p>
          You can request deletion of app data without deleting your account, or request deletion of
          your account and associated app data. Use the in-app Settings screen or visit{" "}
          <Link href="/data-deletion">Dwell data deletion</Link>.
        </p>

        <h2>Children</h2>
        <p>Dwell is a general-audience utility and is not directed at children under 13.</p>

        <h2>Changes</h2>
        <p>
          If a future version of Dwell changes how data is handled, this page will be updated before
          that version ships, with the effective date revised above.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href="mailto:shreyaan.work@gmail.com">shreyaan.work@gmail.com</a>
        </p>
      </article>
    </main>
  );
}

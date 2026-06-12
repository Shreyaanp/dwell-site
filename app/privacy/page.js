import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Dwell on Android and Wear OS.",
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
          it. The short version: <strong>your app data stays on your device.</strong> Dwell requires
          no account, and the Android/Wear OS app does not send your location, chosen place, or timer
          history to us.
        </p>

        <h2>Location</h2>
        <p>
          Dwell uses your device's <strong>precise location</strong> for one purpose: detecting when
          you enter or leave the area you pinned on the map. Geofence monitoring is performed on your
          device by Android's Google Play services. Dwell asks for "Allow all the time" location
          access so this detection works while the app is closed.
        </p>
        <ul>
          <li>Your location is <strong>never transmitted</strong> to the developer or to any server operated by us.</li>
          <li>Your chosen place, radius, and timer settings are stored only in the app's private storage on your phone.</li>
          <li>Uninstalling the app deletes all of it.</li>
        </ul>

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
          <li>No accounts, sign-in, or personal identifiers</li>
          <li>No analytics, tracking, or advertising SDKs</li>
          <li>No selling or sharing of data with third parties</li>
          <li>No location or timer data collection by the developer</li>
        </ul>

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

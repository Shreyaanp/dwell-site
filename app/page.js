import Link from "next/link";

function TimerBadge() {
  return (
    <div className="badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-content" aria-labelledby="dwell-title">
        <TimerBadge />
        <h1 id="dwell-title">Dwell</h1>
        <p className="tagline">
          Pin a place on the map. When you arrive, a timer starts on its own, and your watch tells you
          when your time is up.
        </p>
        <ul className="feature-list">
          <li>Geofence-triggered countdown, default 4.5 hours</li>
          <li>Live countdown on your Wear OS watch</li>
          <li>Asks before cancelling if you leave early</li>
          <li>Everything stays on your device</li>
        </ul>
        <Link className="button-link" href="/privacy">
          Privacy policy
        </Link>
        <footer>
          Built by{" "}
          <a href="https://www.shreyaan.work/" rel="noreferrer">
            Shreyaan Pradhan
          </a>{" "}
          · Android &amp; Wear OS
        </footer>
      </section>
    </main>
  );
}

import Link from "next/link";
import { site } from "../lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: site.name,
  description: site.description,
  url: site.url,
  operatingSystem: "Android, Wear OS",
  applicationCategory: "UtilitiesApplication",
  author: {
    "@type": "Person",
    name: site.author.name,
    url: site.author.url,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  privacyPolicy: `${site.url}/privacy`,
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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
          <li>Privacy controls for deleting app data or account data</li>
        </ul>
        <div className="button-row">
          <Link className="button-link" href="/privacy">
            Privacy policy
          </Link>
          <Link className="button-link" href="/data-deletion">
            Data deletion
          </Link>
        </div>
        <footer>
          Built by{" "}
          <a href={site.author.url} rel="noopener noreferrer">
            {site.author.name}
          </a>{" "}
          · Android &amp; Wear OS
        </footer>
      </section>
    </main>
  );
}

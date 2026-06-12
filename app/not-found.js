import Link from "next/link";

export default function NotFound() {
  return (
    <main className="home-page">
      <section className="home-content" aria-labelledby="not-found-title">
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
        </div>
        <h1 id="not-found-title">Page not found</h1>
        <p className="tagline">The page you are looking for is not available.</p>
        <Link className="button-link" href="/">
          Back to Dwell
        </Link>
      </section>
    </main>
  );
}

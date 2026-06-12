import Link from "next/link";
import { site } from "../../lib/site";
import { DELETION_RETENTION_DAYS } from "../../lib/deletion";

export const metadata = {
  title: "Data deletion",
  description: `Request deletion of ${site.name} app data or account data.`,
  alternates: {
    canonical: "/data-deletion",
  },
  openGraph: {
    title: `${site.name} Data Deletion`,
    description: `Request deletion of ${site.name} app data or account data.`,
    url: "/data-deletion",
  },
};

export default async function DataDeletionPage({ searchParams }) {
  const params = await searchParams;
  const submitted = params?.submitted === "1";

  return (
    <main className="privacy-page">
      <article className="privacy-content">
        <Link className="back-link" href="/">
          Back to Dwell
        </Link>
        <h1>Dwell data deletion</h1>
        <p className="meta">Dwell for Android and Wear OS · Developer: {site.author.name}</p>

        {submitted ? (
          <div className="notice" role="status">
            Your deletion request was received. We will review and process it as described below.
          </div>
        ) : null}

        <p>
          Use this page to request deletion of data associated with the Dwell app. You can request
          deletion of app data without deleting your account, or request deletion of your account
          and associated app data.
        </p>

        <h2>How to request deletion</h2>
        <ol>
          <li>Choose whether you want to delete only app data or delete your account.</li>
          <li>
            Enter the email address you use with Dwell, your app install ID, or both. If you do not
            know your install ID, use your email address and include any helpful details.
          </li>
          <li>Submit the form below. You can also email {site.author.email} with the same request.</li>
        </ol>

        <form className="deletion-form" action="/api/data-deletion" method="post">
          <fieldset>
            <legend>Request type</legend>
            <label>
              <input type="radio" name="requestType" value="delete_data" required /> Delete app
              data only
            </label>
            <label>
              <input type="radio" name="requestType" value="delete_account" required /> Delete my
              account and app data
            </label>
          </fieldset>

          <label>
            Email address
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" />
          </label>

          <label>
            App install ID, if known
            <input type="text" name="installId" placeholder="Optional" />
          </label>

          <label>
            Additional details
            <textarea
              name="message"
              rows="4"
              placeholder="Anything that helps us identify the data to delete"
            />
          </label>

          <button className="button-link" type="submit">
            Submit deletion request
          </button>
        </form>

        <h2>Data deleted</h2>
        <ul>
          <li>Saved geofence zones, including selected place coordinates, radius, and timer defaults.</li>
          <li>Server-side analytics events associated with your Dwell app install or account.</li>
          <li>
            If you request account deletion: account/session records associated with your Dwell app
            install or Google sign-in.
          </li>
        </ul>

        <h2>Data kept and retention</h2>
        <ul>
          <li>
            If you delete only app data, Dwell may keep the account/session record so you can keep
            using the app.
          </li>
          <li>
            Deletion request records are kept for up to {DELETION_RETENTION_DAYS} days so we can
            process and document the request.
          </li>
          <li>
            We may retain limited records longer if required for security, fraud prevention, legal,
            or compliance reasons.
          </li>
        </ul>

        <h2>In-app deletion</h2>
        <p>
          In the Dwell Android app, go to Settings, then Data controls. You can delete app data or
          delete your account from there.
        </p>
      </article>
    </main>
  );
}

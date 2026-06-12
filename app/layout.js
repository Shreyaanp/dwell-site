import "./globals.css";

const siteUrl = "https://dwell.shreyaan.work";
const description =
  "Dwell is an Android and Wear OS app that automatically starts a countdown timer when you arrive at a place you choose on the map.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dwell - arrive, and the timer starts",
    template: "%s | Dwell",
  },
  description,
  openGraph: {
    title: "Dwell",
    description,
    url: siteUrl,
    siteName: "Dwell",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

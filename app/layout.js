import "./globals.css";
import { site } from "../lib/site";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0e1116",
};

export const metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: "Dwell - arrive, and the timer starts",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [
    {
      name: site.author.name,
      url: site.author.url,
    },
  ],
  creator: site.author.name,
  publisher: site.author.name,
  category: "Productivity",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.svg",
    apple: [
      {
        url: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Dwell app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

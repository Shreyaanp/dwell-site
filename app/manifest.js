import { site } from "../lib/site";

export default function manifest() {
  return {
    name: "Dwell - geofence timer for Android and Wear OS",
    short_name: site.name,
    description: site.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0e1116",
    theme_color: "#1a73e8",
    categories: ["productivity", "utilities"],
    lang: "en",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}

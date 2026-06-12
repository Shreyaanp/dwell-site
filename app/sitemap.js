import { site } from "../lib/site";

const routes = [
  {
    path: "/",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.7,
  },
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: new Date("2026-06-12"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

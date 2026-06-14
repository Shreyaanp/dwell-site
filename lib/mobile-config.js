const DEFAULT_SEARCH_BASE_URL = "https://nominatim.openstreetmap.org";
const DEFAULT_SEARCH_USER_AGENT =
  "Dwell/1.0 (work.shreyaan.dwell; +https://dwell.shreyaan.work) Android";
const DEFAULT_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_MAP_ATTRIBUTION_LABEL = "OpenFreeMap | OpenStreetMap";

function cleanUrl(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!/^https?:\/\/[^/\s]+/i.test(text)) return fallback;
  return text.replace(/\/+$/, "");
}

function cleanUserAgent(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length >= 12 ? text.slice(0, 180) : fallback;
}

export function mobileConfigFromEnv(env = process.env) {
  const mapStyleUrl = cleanUrl(env.DWELL_MAP_STYLE_URL, DEFAULT_MAP_STYLE_URL);
  const mapAttributionLabel = cleanUserAgent(
    env.DWELL_MAP_ATTRIBUTION_LABEL,
    DEFAULT_MAP_ATTRIBUTION_LABEL,
  );
  const searchBaseUrl = cleanUrl(
    env.DWELL_SEARCH_BASE_URL || env.NOMINATIM_BASE_URL,
    DEFAULT_SEARCH_BASE_URL,
  );
  const searchUserAgent = cleanUserAgent(
    env.DWELL_SEARCH_USER_AGENT || env.NOMINATIM_USER_AGENT,
    DEFAULT_SEARCH_USER_AGENT,
  );

  return {
    map: {
      provider: "maplibre",
      styleUrl: mapStyleUrl,
      attributionLabel: mapAttributionLabel,
    },
    search: {
      provider: "nominatim",
      baseUrl: searchBaseUrl,
      userAgent: searchUserAgent,
      autocomplete: false,
      minQueryLength: 3,
      networkCooldownMs: 1500,
      cacheTtlMs: 30 * 60 * 1000,
    },
  };
}

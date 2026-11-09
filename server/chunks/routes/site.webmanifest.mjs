import { d as defineEventHandler, a as setHeader, b as siteName } from '../nitro/nitro.mjs';
import 'unhead/server';
import 'vue';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const site_webmanifest = defineEventHandler((event) => {
  setHeader(event, "content-type", "application/manifest+json");
  return {
    name: siteName,
    short_name: siteName,
    description: "Bun + Nuxt \u591A\u8BED\u8A00\u7AD9\u70B9",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0070f3",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  };
});

export { site_webmanifest as default };
//# sourceMappingURL=site.webmanifest.mjs.map

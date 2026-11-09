import { d as defineEventHandler, s as siteOrigin, u as useRuntimeConfig, L, a as setHeader, i as i18n } from '../nitro/nitro.mjs';
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

const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sitemap_xml = defineEventHandler((event) => {
  const baseUrl = siteOrigin(useRuntimeConfig(event).public.siteUrl);
  const entries = L(
    i18n,
    [
      { path: "/dashboard", changeFrequency: "monthly", priority: 0.8 },
      { path: "/home", changeFrequency: "monthly", priority: 0.8 }
    ],
    { baseUrl }
  );
  const urls = entries.map((entry) => {
    var _a, _b;
    const alternates = Object.entries((_b = (_a = entry.alternates) == null ? void 0 : _a.languages) != null ? _b : {}).map(
      ([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`
    );
    return [
      "<url>",
      `<loc>${escapeXml(entry.url)}</loc>`,
      ...entry.lastModified === void 0 ? [] : [`<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`],
      ...entry.changeFrequency === void 0 ? [] : [`<changefreq>${entry.changeFrequency}</changefreq>`],
      ...entry.priority === void 0 ? [] : [`<priority>${entry.priority}</priority>`],
      ...alternates,
      "</url>"
    ].join("");
  });
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>"
  ].join("\n");
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map

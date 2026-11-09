import { d as defineEventHandler, s as siteOrigin, u as useRuntimeConfig, U, a as setHeader } from '../nitro/nitro.mjs';
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

const toList = (value) => value === void 0 ? [] : Array.isArray(value) ? value : [value];
const robots_txt = defineEventHandler((event) => {
  const baseUrl = siteOrigin(useRuntimeConfig(event).public.siteUrl);
  const robots = U({ baseUrl });
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  const lines = rules.flatMap((rule) => [
    `User-agent: ${rule.userAgent}`,
    ...toList(rule.allow).map((value) => `Allow: ${value}`),
    ...toList(rule.disallow).map((value) => `Disallow: ${value}`),
    ...rule.crawlDelay === void 0 ? [] : [`Crawl-delay: ${rule.crawlDelay}`]
  ]);
  if (robots.sitemap !== void 0) lines.push(`Sitemap: ${robots.sitemap}`);
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return `${lines.join("\n")}
`;
});

export { robots_txt as default };
//# sourceMappingURL=robots.txt.mjs.map

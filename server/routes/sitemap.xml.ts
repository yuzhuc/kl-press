import { generateSitemap, i18n, siteOrigin } from '~/i18n'

/** Escapes the five XML entities in a URL. */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export default defineEventHandler((event) => {
  const baseUrl = siteOrigin(useRuntimeConfig(event).public.siteUrl)
  const entries = generateSitemap(
    i18n,
    [
      { path: '/dashboard', changeFrequency: 'monthly', priority: 0.8 },
      { path: '/home', changeFrequency: 'monthly', priority: 0.8 },
    ],
    { baseUrl },
  )

  const urls = entries.map((entry) => {
    const alternates = Object.entries(entry.alternates?.languages ?? {}).map(
      ([hreflang, href]) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
    )
    return [
      '<url>',
      `<loc>${escapeXml(entry.url)}</loc>`,
      ...(entry.lastModified === undefined
        ? []
        : [`<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`]),
      ...(entry.changeFrequency === undefined
        ? []
        : [`<changefreq>${entry.changeFrequency}</changefreq>`]),
      ...(entry.priority === undefined ? [] : [`<priority>${entry.priority}</priority>`]),
      ...alternates,
      '</url>',
    ].join('')
  })

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n')
})

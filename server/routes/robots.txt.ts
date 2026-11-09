import { generateRobots, siteOrigin } from '~/i18n'

const toList = (value?: string | string[]): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export default defineEventHandler((event) => {
  const baseUrl = siteOrigin(useRuntimeConfig(event).public.siteUrl)
  const robots = generateRobots({ baseUrl })
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules]

  const lines = rules.flatMap((rule) => [
    `User-agent: ${rule.userAgent}`,
    ...toList(rule.allow).map((value) => `Allow: ${value}`),
    ...toList(rule.disallow).map((value) => `Disallow: ${value}`),
    ...(rule.crawlDelay === undefined ? [] : [`Crawl-delay: ${rule.crawlDelay}`]),
  ])
  if (robots.sitemap !== undefined) lines.push(`Sitemap: ${robots.sitemap}`)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${lines.join('\n')}\n`
})

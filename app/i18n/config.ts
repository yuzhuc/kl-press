import { defineI18n } from '@yuzhuc/i18n'
import en from './dictionaries/en.json'
import zh from './dictionaries/zh.json'
import ja from './dictionaries/ja.json'

export const locales = ['en', 'zh', 'ja'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const i18n = defineI18n({
  locales,
  defaultLocale,
  messages: { en, zh, ja },
  displayNames: {
    en: { native: 'English', english: 'English' },
    zh: { native: '中文', english: 'Chinese' },
    ja: { native: '日本語', english: 'Japanese' },
  },
})

/** Route segment name, so `pages/[language]/…` and the middleware agree. */
export const localeParam = 'language' as const

/** Every page lives under a sub-path, so the locale root redirects here. */
export const landingPath = '/dashboard'

/** Open Graph wants `en_US`; keep the mapping next to the locales. */
export const ogLocaleMap: Partial<Record<Locale, string>> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
}

export const siteName = 'Bun-Nuxt'

/**
 * A configured value as an origin: adds `https://` to a bare domain (the form
 * the Next template's `NEXT_PUBLIC_SITE_DOMAIN` takes) and drops the trailing
 * slash, so `example.com` and `https://example.com/` both become
 * `https://example.com`.
 */
export function siteOrigin(value: string | undefined | null): string {
  if (!value) return ''
  const trimmed = value.trim().replace(/\/+$/, '')
  if (trimmed === '') return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/**
 * The site origin for canonical / hreflang / OG / sitemap.
 *
 * Next reads `process.env.NEXT_PUBLIC_SITE_DOMAIN` in app source because it
 * inlines those references at build. Nuxt has no such inlining: `process.env`
 * is not available in the browser, so the same value arrives through
 * `runtimeConfig.public.siteUrl`, which Nuxt fills from `NUXT_PUBLIC_SITE_URL`.
 * Calling it at render time keeps one source for both the server (runtime env)
 * and a static export (build-time env).
 */
export function useBaseUrl(): string {
  return siteOrigin(useRuntimeConfig().public.siteUrl)
}

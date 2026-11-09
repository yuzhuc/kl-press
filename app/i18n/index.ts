/**
 * The app's i18n module. Everything imports from here, so adding a locale or
 * swapping a helper touches one directory.
 */
export {
  defaultLocale,
  i18n,
  landingPath,
  localeParam,
  locales,
  ogLocaleMap,
  siteName,
  siteOrigin,
  useBaseUrl,
  type Locale,
} from './config'

export { useLocalePageMeta } from './head'

export {
  buildPageMetadata,
  generateAlternates,
  generateRobots,
  generateSitemap,
  generateWebsiteJsonLd,
  getOgLocale,
  getOgLocaleAlternates,
  serializeJsonLd,
} from '@yuzhuc/i18n/seo'
export {
  LOCALE_COOKIE,
  negotiateLocale,
  normalizeLocalePath,
  planLocaleRedirect,
  readLocaleCookie,
  stripLocale,
  switchLocalePath,
  writeLocaleCookie,
} from '@yuzhuc/i18n/routing'
export { Trans, useFormatter, useI18n, useLocale, useTranslations } from '@yuzhuc/i18n/vue'
export { getLocaleDirection } from '@yuzhuc/i18n'

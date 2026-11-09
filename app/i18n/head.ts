import { localeHead } from '@yuzhuc/i18n/head'
import { useI18n } from '@yuzhuc/i18n/vue'
import { i18n, ogLocaleMap, siteName, useBaseUrl, type Locale } from './config'

type PageMetaOptions = {
  /** Social preview image; a relative path is resolved against `siteUrl`. */
  image?: { url: string; width?: number; height?: number; alt?: string }
  /** Keep the page out of search results. */
  noIndex?: boolean
  /** `hreflang` tags when they differ from the locale codes (e.g. zh → zh-Hans). */
  hreflangMap?: Partial<Record<Locale, string>>
}

const defaultImage = { url: '/og.png', width: 1200, height: 630, alt: siteName }

/** Canonical, hreflang, Open Graph, Twitter and JSON-LD for one localised page. */
export function useLocalePageMeta(
  path: string,
  title: () => string,
  description: () => string,
  options: PageMetaOptions = {},
) {
  const { locale } = useI18n<Locale>()
  // Runtime env on a server, build-time env on a static export.
  const baseUrl = useBaseUrl()

  useHead(() =>
    localeHead(i18n, {
      locale: locale.value,
      path,
      baseUrl,
      siteName,
      ogLocaleMap,
      title: title(),
      description: description(),
      image: options.image ?? defaultImage,
      noIndex: options.noIndex,
      hreflangMap: options.hreflangMap,
      website: { alternateName: `${siteName} 多语言站点` },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          ...(baseUrl ? { url: `${baseUrl}/`, logo: `${baseUrl}/favicon.ico` } : {}),
        },
      ],
    }),
  )
}

import { siteName } from '~/i18n/config'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/manifest+json')
  return {
    name: siteName,
    short_name: siteName,
    description: 'Bun + Nuxt 多语言站点',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0070f3',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
})

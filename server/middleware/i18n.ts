import { i18n, landingPath, LOCALE_COOKIE, planLocaleRedirect, readLocaleCookie } from '~/i18n'

// `_nuxt` assets, `/api/*` and static files never take a locale prefix.
const noRedirect = /^\/(?:_nuxt|__nuxt|api)(?=[/._]|$)|\.[^/]+$/

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (noRedirect.test(url.pathname)) return

  const target = planLocaleRedirect(i18n, url.pathname, getHeader(event, 'accept-language'), {
    preference: readLocaleCookie(getHeader(event, 'cookie'), LOCALE_COOKIE),
    landingPath,
  })
  if (target === null) return

  setResponseHeader(event, 'vary', 'Accept-Language')
  return sendRedirect(event, `${target}${url.search}`, 307)
})

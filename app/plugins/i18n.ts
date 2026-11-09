import { createNuxtI18nPlugin } from '@yuzhuc/i18n/nuxt'
import { i18n } from '~/i18n'

export default defineNuxtPlugin((nuxtApp) => {
  // Development only: missing keys and placeholder drift, once per locale.
  // Server-side keeps it out of the browser console.
  if (import.meta.dev && import.meta.server) i18n.checkMessages()

  createNuxtI18nPlugin(i18n)(nuxtApp)
})

import { createLocaleServerMiddleware } from '@yuzhuc/i18n/nuxt'
import { i18n, landingPath } from '~/i18n'

export default createLocaleServerMiddleware(i18n, { landingPath })

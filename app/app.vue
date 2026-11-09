<script setup lang="ts">
import { useI18n } from '@yuzhuc/i18n/vue'
import { i18n, siteName, type Locale } from '~/i18n'

const { locale, dir, setLocale } = useI18n<Locale>()
const route = useRoute()

// The URL wins for `/[language]/...`; the plugin's cookie / Accept-Language
// choice only seeds pages that carry no locale.
watch(
  () => route.params.language,
  (value) => {
    if (typeof value === 'string' && i18n.hasLocale(value)) setLocale(value)
  },
  { immediate: true },
)

useHead({
  titleTemplate: (title) => (title ? `${siteName} | ${title}` : siteName),
  meta: [{ name: 'theme-color', content: '#0070f3' }],
  link: [
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-icon.png', sizes: '180x180' },
  ],
})
useHead(() => ({ htmlAttrs: { lang: locale.value, dir: dir.value } }))
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>

<style>
:root {
  color-scheme: light dark;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.page {
  max-width: 40rem;
  margin: 4rem auto;
  padding: 0 1rem;
  line-height: 1.6;
}
.bounce {
  display: grid;
  place-items: center;
  height: 100vh;
}
.ring {
  width: 2rem;
  height: 2rem;
  border: 3px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ring {
    animation-duration: 2.4s;
  }
}
</style>

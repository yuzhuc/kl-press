<script setup lang="ts">
import {
  defaultLocale,
  i18n,
  landingPath,
  negotiateLocale,
  planLocaleRedirect,
  stripLocale,
  type Locale,
} from '~/i18n'

defineProps<{ error: NuxtError }>()

// Start from the default locale so the server render and the first client
// render agree; the real locale is picked once mounted.
const locale = ref<Locale>(defaultLocale)

onMounted(() => {
  // The server middleware handles every matched path; this catches what its
  // reserved list skips (anything with a dot, for instance), with the same
  // function the middleware uses.
  const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language]
  const accept = languages.join(',')
  const target = planLocaleRedirect(i18n, location.pathname, accept, { landingPath })
  if (target !== null) {
    location.replace(target + location.search)
    return
  }
  locale.value = stripLocale(i18n, location.pathname)?.locale ?? negotiateLocale(i18n, accept)
})

const tr = computed(() => i18n.createTranslator(locale.value))

useHead(() => ({
  title: tr.value('site.notFound.title'),
  meta: [{ name: 'robots', content: 'noindex' }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <main class="page">
    <p class="code">404</p>
    <h1>{{ tr('site.notFound.title') }}</h1>
    <p>{{ tr('site.notFound.description') }}</p>
    <!-- A full load: the error state has to be cleared, not routed around. -->
    <a class="back" :href="`/${locale}${landingPath}`">{{ tr('site.notFound.back') }}</a>
  </main>
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
  text-align: center;
}
.code {
  font-weight: 600;
}
</style>

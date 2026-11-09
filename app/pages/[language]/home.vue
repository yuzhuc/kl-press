<script setup lang="ts">
import { useTranslations } from '@yuzhuc/i18n/vue'
import { i18n, useLocalePageMeta } from '~/i18n'

definePageMeta({ validate: (route) => i18n.hasLocale(String(route.params.language)) })

const t = useTranslations(i18n)

useLocalePageMeta(
  '/home',
  () => t('site.title.home'),
  () => t('site.description.home'),
)
</script>

<template>
  <div class="page">
    <h1>{{ t('home.greeting', { name: '访客' }) }}</h1>
    <p>{{ t('home.intro') }}</p>
  </div>
</template>

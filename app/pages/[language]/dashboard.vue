<script setup lang="ts">
import { useTranslations } from '@yuzhuc/i18n/vue'
import { i18n, useLocalePageMeta } from '~/i18n'

definePageMeta({ validate: (route) => i18n.hasLocale(String(route.params.language)) })

const t = useTranslations(i18n)

useLocalePageMeta(
  '/dashboard',
  () => t('site.title.dashboard'),
  () => t('site.description.dashboard'),
)
</script>

<template>
  <div class="page">
    <h1>{{ t('dashboard.greeting', { name: '访客' }) }}</h1>
    <p>{{ t('dashboard.intro') }}</p>
  </div>
</template>

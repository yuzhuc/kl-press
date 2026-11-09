# SEO 指南（服务端版）

## 一、已经具备（正常开发不用动）

- 每页 **title / description**（三语，来自词库）
- **canonical + hreflang**（三语 + `x-default`）
- **OG / Twitter 卡片**（标题、描述、分享图、`site_name`、`og:locale`）
- **JSON-LD**：每页输出 `WebSite` + 精简 `Organization`
- `sitemap.xml`、`robots.txt`、`site.webmanifest`、多尺寸图标、`theme-color`
- `<html lang>` / `dir` 跟随语言
- 多语言 404（`noindex`，按 URL 前缀 → 浏览器语言选文案）

这些都在 `app/i18n/head.ts` 的 `useLocalePageMeta` → 包的 `localeHead` 里生成，页面只传路径和文案。

## 二、上线激活：`NUXT_PUBLIC_SITE_URL`

```ini
NUXT_PUBLIC_SITE_URL=https://example.com
```

- ✅ `example.com`（裸域名，和 Next 版的 `NEXT_PUBLIC_SITE_DOMAIN` 写法一致）
- ✅ `https://example.com`（带协议也认）
- 尾斜杠会被去掉；两种写法都由 `app/i18n/config.ts` 的 `siteOrigin()` / `useBaseUrl()` 处理

设置后自动变成绝对地址的部分：canonical / hreflang / `og:image` / `og:url` / JSON-LD `url`+`logo` / sitemap `<loc>` / robots 的 `Sitemap:` 行。

**服务端版是运行时读取**（`runtimeConfig.public.siteUrl`），改环境变量重启即可，不用重新构建。Docker 里写进 `compose.yml` 的 environment 或 `docker run -e`。

## 三、替换品牌名（搜索 "Bun-Nuxt"）

| 位置 | 改 |
| --- | --- |
| `app/i18n/config.ts` | `siteName` |
| `app/app.vue` | 用的是 `siteName`，一般不用动 |
| `server/routes/site.webmanifest.ts` | `description`、`icons` |
| `package.json` | `name` |

## 四、图片（同名覆盖 `public/` 即生效）

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `icon.svg` | 矢量 | 站点图标 / manifest 主图标 |
| `favicon.ico` | 32×32 | 旧浏览器 |
| `apple-icon.png` | 180×180 | iOS 添加到主屏 |
| `android-chrome-192x192.png` | 192×192 | Android 图标 |
| `android-chrome-512x512.png` | 512×512 | PWA 大图标 |
| `og.png` | 1200×630 | 社交分享卡片 |

除 `favicon.ico` 外当前都是占位图。

## 五、分享卡片上的文字在哪改

- **页面级**（分享 `/zh/dashboard`）：`app/i18n/dictionaries/{en,zh,ja}.json` 里的 `site.title.<页>` / `site.description.<页>`，改词库即全改（先改 en）。
- **站点名**：`app/i18n/config.ts` 的 `siteName`。
- **分享图**：`public/og.png`，在 `useLocalePageMeta` 里默认使用。

## 六、新增页面

1. `app/pages/[language]/<页>.vue`，照 `dashboard.vue` 写。
2. 调 `useLocalePageMeta('/<路径>', () => t(...), () => t(...))`，canonical / hreflang / OG 一次生成。
3. 词库加 key（三语同步，键必须一致）。
4. `server/routes/sitemap.xml.ts` 的 `routes` 加 `{ path: '/<路径>' }`。

hreflang 想输出 `zh-Hans` 这类标签而不是声明的 `zh` 时，给 `useLocalePageMeta` 加 `hreflangMap`。

## 七、页面不想被收录

```ts
useLocalePageMeta('/secret', () => t(...), () => t(...), { noIndex: true })
```

输出 `robots: noindex, nofollow`。

## 八、加语言的 SEO 联动

`config.ts` 加语言 → 词库 → `ogLocaleMap` 补行，之后 hreflang / sitemap / JSON-LD `inLanguage` / 404 文案 / `<html lang>` 自动带上。

## 九、上线清单

- Google Search Console：验证域名、提交 `sitemap.xml`
- 确认 `robots.txt` 里有 `Sitemap: https://example.com/sitemap.xml`
- PageSpeed Insights 看 LCP / INP
- 分享 `https://example.com/` 和各语言页面，确认卡片
- 确认响应头带 `Vary: Accept-Language`（中间件已设置；CDN 上别抹掉）

## 十、这个项目特有的坑

- **域名两种写法都行**（`example.com` / `https://example.com`），`siteOrigin()` 统一补协议、去尾斜杠。
- **`sitemap.xml` / `robots.txt` / `site.webmanifest` 是 server route**，不是静态文件：改它们要重启/重新构建。
- **JSON 字典只校验 key**，占位符写错不会编译报错。
- **中间件放行带点的路径**：`/foo.bar` 不会重定向，会落到 `error.vue`（`noindex`）。
- **Nuxt 的 404 是 `app/error.vue`**，不在 `pages/` 下；`pages/[language]/` 里再加 `not-found` 页不生效。

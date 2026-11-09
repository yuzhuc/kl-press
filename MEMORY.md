# MEMORY — bun-nuxt（服务端版）

> 新对话接续本项目先读这里。操作细节见同目录 `i18n.md` 与 `SEO.md`。

## 项目是什么

Bun + Nuxt 4 多语言模板，**node-server 预设（`nuxt build` → `.output`）**，三语 en/zh/ja。i18n 用自研的 `@yuzhuc/i18n`（vendor 在 `package/i18n`），含完整 SEO、Docker 与 GitHub Actions。

## 常用命令

- 开发：`bun run dev`
- 构建：`bun run build` → `.output/server/index.mjs` + `.output/public`
- 启动：`bun .output/server/index.mjs`（`PORT` / `HOST` 环境变量）
- Docker：`docker compose up --build`（端口 3000）

## 当前结构要点

- 页面：`app/pages/[language]/{dashboard,home}.vue`；**没有** `[language]/index.vue`（语言根由中间件跳走）
- 协商与重定向：`server/middleware/i18n.ts` → `createLocaleServerMiddleware(i18n, { landingPath })`，内部是 `planLocaleRedirect`；`/_nuxt`、`/__nuxt`、`/api` 和带扩展名的路径自动放行，响应带 `Vary: Accept-Language`
- 404：`app/error.vue`（客户端按 URL 前缀 → 浏览器语言选文案），对中间件放行的路径用同一个 `planLocaleRedirect` 兜底
- 页面 head：`app/i18n/head.ts` 的 `useLocalePageMeta` → 包的 `localeHead`（canonical / hreflang / OG / Twitter / JSON-LD）
- `package/i18n` 是**压缩后的**发布产物，不是源码；改包在 `npmjs-i18n` 里 `npm run build:protected` 后复制 `dist` + `package.json`

## 历史（关键决策）

- i18n 直接照 `bun-nextjs` 的方案做：同样的三语、同样的字典键、同样的 `landingPath`、同样由包负责协商与 SEO
- 重定向不写在 `nuxt.config` 的 `routeRules` 里，而是用包的 `createLocaleServerMiddleware`：`routeRules` 在预渲染/静态下行为不一致
- SEO 走包的 `/head` 入口（unhead 形状），页面只调 `useLocalePageMeta`
- 静态版另有 `scripts/write-404.ts`；服务端版不需要，Nitro 会 SSR 渲染 `error.vue`
- 包里做过性能优化：复数分类缓存、翻译器按 locale 记忆化（`createTranslator` 627ns → 24ns）

## 关键约束（别踩）

- **JSON 字典只保证 key 的类型**：TS 把 JSON 字符串拓宽成 `string`，占位符不参与编译校验（要换成 `.ts` + `as const` 才有）
- 词库键集合必须完全一致，缺/多键直接编译失败
- `[language]` 下的页面要 `definePageMeta({ validate })`，否则未声明的语言会渲染默认语言内容
- 不要把静态版的 `nuxt build` 用在本项目上：本项目 `build` 就是 `nuxt build`，产物是 node-server
- 中间件直接写 `event.node.res`，只覆盖 Node/bun/预渲染运行时；换 edge preset 要改实现

## 上线前

1. 设置 `NUXT_PUBLIC_SITE_URL`（`example.com` 或 `https://example.com` 都行；运行时读取）
2. 品牌替换：搜索 "Bun-Nuxt"
3. 换 `public/` 下的占位图（`icon.svg` / `apple-icon.png` / `android-*.png` / `og.png`）
4. `ja.json` 的 `site.title` / `site.description` 目前是英文

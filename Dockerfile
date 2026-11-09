# 1. 依赖阶段：安装全部依赖（无损缓存 node_modules 供 builder 复用）
FROM oven/bun:1 AS dependencies
WORKDIR /app
COPY package.json bun.lock* ./
# 自有包在 package/ 下，workspace 依赖需要它先存在
COPY package ./package
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --no-save --frozen-lockfile

# 2. 构建阶段：nuxt build 产出 .output（node-server 预设，自包含）
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 3. 运行阶段：.output 里已含服务端与静态资源，运行时只需要 PORT/HOST
FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=builder --chown=bun:bun /app/.output ./.output
USER bun
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]

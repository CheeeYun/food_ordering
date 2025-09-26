# 建置階段 - 添加 AS base 並統一架構
FROM --platform=linux/amd64 node:20-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

# 複製 Prisma schema
COPY prisma/ ./prisma/

# 複製其他應用程式碼
COPY . .
RUN npx prisma generate
RUN npm run build

# 生產階段 - 統一使用 amd64 架構
FROM --platform=linux/amd64 node:20-slim AS production

WORKDIR /app

# 從第一階段複製檔案
COPY --from=base /app/.output /app/.output
COPY --from=base /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

# 修正用戶建立語法 - 適用於 Debian/Ubuntu (slim)
RUN groupadd -r nodejs -g 1001
RUN useradd -r -g nodejs -u 1001 nuxt

USER nuxt

EXPOSE 3000

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", ".output/server/index.mjs"]
# 使用官方 Node.js 20 作為基礎映像
FROM --platform=linux/arm64 node:20-alpine AS base

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production && npm cache clean --force

# 複製應用程式碼
COPY . .

# 生成 Prisma 客戶端
RUN npx prisma generate

# 建置應用程式
RUN npm run build

# 生產階段
FROM --platform=linux/arm64 node:20-alpine AS production

WORKDIR /app

# 只複製必要的檔案
COPY --from=base /app/.output /app/.output
COPY --from=base /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=base /app/package*.json ./

# 安裝生產環境依賴
RUN npm ci --only=production && npm cache clean --force

# 建立非 root 使用者
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# 變更檔案擁有者
USER nuxt

# 暴露端口
EXPOSE 3000

# 設置環境變數
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 啟動應用程式
CMD ["node", ".output/server/index.mjs"]
# Docker container + proxy_pass
FROM node:20.11.1-alpine

WORKDIR /app

# 複製並安裝依賴
COPY package*.json ./
RUN npm install

# 複製原始碼
COPY . .

# ✅ 掃描 composables、自動匯入等等
RUN npx nuxi prepare

# ✅ 建置 Nuxt SSR
RUN npm run build

# 開放 port
EXPOSE 3000

# 啟動 Nuxt SSR
CMD ["node", ".output/server/index.mjs"]

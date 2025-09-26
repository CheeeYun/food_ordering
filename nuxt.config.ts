import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  devtools: {enabled: false},
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    // Private keys (只在服務器端可用)
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

    // Public keys (客戶端也可用)
    public: {
      lineChannelId: process.env.LINE_CHANNEL_ID,
      lineRedirectUri: process.env.LINE_REDIRECT_URI,
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
});

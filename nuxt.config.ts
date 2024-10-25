// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  // 在配置對象之外使用 console.log 而不是在回調函數內
  modules: ['nuxtjs-naive-ui', '@nuxtjs/tailwindcss', '@nuxt/eslint', '@pinia/nuxt'],

  imports: {
    dirs: ['stores'], // 預設有 composables 和 utils
  },

  devtools: { enabled: true },
  app: {
    head: {
      title: process.env.NUXT_APP_TITLE || 'Default Title',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      ],
      link: [],
    },
    pageTransition: {
      name: 'fade', mode: 'out-in',
    },
    layoutTransition: {
      name: 'fade', mode: 'out-in',
    },
  },

  css: ['~/assets/css/normalize.css', '~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: `${process.env.NUXT_BASE_URL}${process.env.NUXT_BASE_API}`,
      APP_TITLE: process.env.NUXT_TITLE,
      imgUrl: process.env.NUXT_IMG_URL,
      LineChannel: process.env.NUXT_LINE_CHANNEL_ID,
      LineSecret: process.env.NUXT_LINE_CHANNEL_SECRET,
    },
  },
  vite: {
    server: {
      proxy: process.env.NODE_ENV !== 'Dev' ? {} : {
        '/api/': {
          target: process.env.NUXT_BASE_API, // 設置預設值
          changeOrigin: true,
        },
      },
    },
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useButton',
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],

  },
  typescript: {
    typeCheck: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  hooks: {
    ready: () => {
      console.log('====================模式與環境====================')
      console.log('WebTitle', process.env.NUXT_TITLE)
      console.log('apiBase', `${process.env.NUXT_BASE_URL}${process.env.NUXT_BASE_API}`)
      console.log('=================================================')
    },
  },
  eslint: {
    checker: {
      configType: 'eslintrc',
    },
    config: {
      stylistic: true,
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  modules: ["nuxtjs-naive-ui", "@nuxtjs/tailwindcss", "@nuxt/eslint", "@pinia/nuxt"],

  imports: {
    dirs: ["stores", "composables/oAuth", "composables/socket"], // 預設有 composables 和 utils
  },

  build: {
    transpile: ['naive-ui', 'vueuc']
},

  devtools: { enabled: true },

  app: {
    head: {
      title: process.env.NUXT_TITLE || "Default Title",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" },
      ],
      link: [],
    },
    pageTransition: {
      name: "fade", mode: "out-in",
    },
    layoutTransition: {
      name: "layout", mode: "out-in",
    },
  },

  css: ["~/assets/css/normalize.css", "~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      mode: process.env.NODE_ENV,
      baseUrl: process.env.NUXT_BASE_URL,
      apiPattern: process.env.NUXT_BASE_API,
      APP_TITLE: process.env.NUXT_TITLE,
      imgUrl: process.env.NUXT_IMG_URL,
      LineChannel: process.env.NUXT_LINE_CHANNEL_ID,
      LineSecret: process.env.NUXT_LINE_CHANNEL_SECRET,
      GoogleClientId: process.env.NUXT_GOOGLE_CLIENTID,
      GithubClientId: process.env.NUXT_GITHUB_CLIENTID,
      GithubSecret: process.env.NUXT_GITHUB_SECRET,
    },
  },

  ssr: false,

  vite: {
    server: {
        proxy: process.env.NODE_ENV !== "development" ? {} : {
          "/chatRoom/nuxt-api": {
            target: `${process.env.NUXT_BASE_URL}/nuxt-api`,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/chatRoom\/nuxt-api/, "/nuxt-api"),
          },
      }
    },
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useButton",
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],

  },

  // typescript: {
  //   typeCheck: true,
  // },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  hooks: {
    ready: () => {
      console.log("====================模式與環境====================");
      console.log("WebTitle", process.env.NUXT_TITLE);
      console.log("Mode", process.env.NODE_ENV);
      console.log("apiBase", `${process.env.NUXT_BASE_URL}${process.env.NUXT_BASE_API}`);
      console.log("=================================================");
    },
  },

  compatibilityDate: "2024-11-11",
});
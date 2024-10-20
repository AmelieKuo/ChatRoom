import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: [],
  rules: {
    'no-undef': 'off'
  }
}
)



// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//     node: true
//   },
//   extends: ['@nuxtjs/eslint-config-typescript', 'plugin:vue/vue3-recommended'],
//   parserOptions: {
//     ecmaVersion: 13,
//     sourceType: 'module'
//   },
//   plugins: [],
//   rules: {
//     'no-undef': 'off'
//   }
// }
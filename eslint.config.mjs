import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // ...pluginVue.configs['flat/recommended'],
  files: ['**/*.{js,ts,vue}'],
  languageOptions: {
    globals: {
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
      process: 'readonly',
      module: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  ignores: [
    '.output',
    'node_modules/**',
    '**/*.d.ts',
    '**/*.d.js',
    'README.md',
    '.gitignore',
    'public/**',
    'assets/**',
  ],
  rules: {
    'semi': ['error', 'always'],
    'no-undef': 'off',
    'no-process-env': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
},
)

import withNuxt from './.nuxt/eslint.config.mjs'
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"

import stylistic from '@stylistic/eslint-plugin'
import nuxtRule from '@nuxt/eslint-config'

export default withNuxt(
  {
    ...nuxtRule.configs['flat/recommended'],
    ...eslintRule.configs['flat/recommended'],
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
      },
      parserOptions: {
        ...tseslint.parse,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    plugins: {
      '@stylistic': stylistic,
      'vue': pluginVue,
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
      'no-extra-semi': 'error',
      'quotes': ['error', 'double', { allowTemplateLiterals: true }],
      'no-undef': 'off',
      'no-process-env': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': [0],
      'no-plusplus': 'off',
      'sort-imports': ['error', {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      }],
    },
    settings: {
      'import/resolver': {
        typescript: {},
        alias: {
          map: [
            ['@', './src'],
            ['~', './'],
          ],
          extensions: ['.js', '.vue'],
        },
      },
    },
  },
)

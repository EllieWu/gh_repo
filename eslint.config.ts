import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/strongly-recommended'],
  vueTsConfigs.recommended,

  // 自訂 Vue 規則
  {
    files: ['**/*.vue'],
    rules: {
      // 允許單字元件名
      'vue/multi-word-component-names': 'off',
      // props 必須定義型別
      'vue/require-prop-types': 'error',
      // emit 必須定義
      'vue/require-explicit-emits': 'error',
      // template 中不可使用 v-html（XSS 風險）
      'vue/no-v-html': 'warn',
      // 屬性順序：先 v-if/v-for，再 :prop，再 @event
      'vue/attributes-order': 'warn',
      // script setup 中的 defineProps/defineEmits 不需要 import
      'vue/no-undef-components': 'error',
      // 忽略 _ 開頭的變數
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)

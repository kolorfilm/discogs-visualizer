import js from '@eslint/js'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jestPlugin from 'eslint-plugin-jest'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    extends: [
      js.configs.recommended,
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      jest: jestPlugin,
    },
    ignores: ['**/public/**', '**/.next/**'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['server/**', 'setupTests.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
)

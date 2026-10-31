import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import-x'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: {
      'import-x': importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'import-x/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: false },
        },
      ],
      curly: ['error', 'all'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])

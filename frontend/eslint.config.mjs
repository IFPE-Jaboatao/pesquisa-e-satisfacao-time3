import js from '@eslint/js'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: js.configs.recommended.rules,
  },
]

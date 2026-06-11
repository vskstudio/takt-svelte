import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist/**', 'node_modules/**', '.svelte-kit/**'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]

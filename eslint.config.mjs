import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  { ignores: ['node_modules', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ...playwright.configs['flat/recommended'], files: ['tests/**/*.ts'] },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'playwright/expect-expect': 'off',
      'playwright/valid-title': 'off',
      'playwright/no-conditional-in-test': 'off',
    },
  },
);

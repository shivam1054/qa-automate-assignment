/**
 * Central runtime configuration. Values can be overridden via environment variables
 * (see .env.example). ลอตเตอรี่พลัส.com is an IDN domain, so the punycode form is used.
 */
export const ENV = {
  baseUrl: process.env.BASE_URL ?? 'https://xn--m3ca1athe9asc7b2b6iqe.com',
  lineLoginHost: 'access.line.me',
  isCI: !!process.env.CI,
} as const;

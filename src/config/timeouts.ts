export const TIMEOUT = {
  test: 45_000,
  expect: 10_000,
  action: 15_000,
  navigation: 30_000,
  /** Optional UI such as the cookie banner. */
  optionalElement: 5_000,
  /** Third-party redirects (LINE OAuth). */
  externalRedirect: 20_000,
} as const;

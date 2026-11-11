export const TIMEOUT = {
  test: 45_000,
  expect: 10_000,
  action: 15_000,
  navigation: 30_000,
  /** Optional UI such as the cookie banner. */
  optionalElement: 5_000,
  /** Search results are loaded from an API after navigation. */
  searchResults: 25_000,
  /** Retry window for clicks that happen before React hydration. */
  hydration: 20_000,
  /** Third-party redirects (LINE OAuth). */
  externalRedirect: 20_000,
} as const;

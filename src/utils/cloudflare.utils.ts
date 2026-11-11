import { Response, test } from '@playwright/test';

export const CLOUDFLARE_BLOCK_REASON =
  'Cloudflare bot protection served a challenge page instead of the site (common for CI / data-centre IPs). ' +
  'Run locally, or use a test environment / allow-listed runner.';

/**
 * True when Cloudflare answered with a challenge instead of the real page.
 * Cloudflare marks these responses with the `cf-mitigated: challenge` header (usually status 403/503).
 */
export const isCloudflareChallenge = (response: Response | null): boolean => {
  if (!response) return false;
  const headers = response.headers();
  if (headers['cf-mitigated'] === 'challenge') return true;
  return [403, 503].includes(response.status()) && (headers['server'] ?? '').toLowerCase().includes('cloudflare');
};

/**
 * Skips the running test (with a visible reason in the report) when the page is a Cloudflare challenge.
 * The protection is never bypassed – the test simply cannot run in that environment.
 */
export const skipIfCloudflareChallenge = (response: Response | null): void => {
  test.skip(isCloudflareChallenge(response), CLOUDFLARE_BLOCK_REASON);
};

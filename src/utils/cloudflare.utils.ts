import { Page, Response, test } from '@playwright/test';

export const CLOUDFLARE_BLOCK_REASON =
  'Cloudflare blocked this runner (challenge or 401/403 instead of the site – common for CI / data-centre / non-Thai IPs). ' +
  'Run locally, or use a test environment / allow-listed runner.';

/**
 * True when Cloudflare refused or challenged the request instead of serving the site:
 * - `cf-mitigated: challenge` header (managed challenge), or
 * - a 401/403/429/503 answered by Cloudflare itself (WAF / geo / data-centre IP block –
 *   GitHub-hosted runners get `401` with an empty `{}` body).
 */
export const isCloudflareChallenge = (response: Response | null): boolean => {
  if (!response) return false;
  const headers = response.headers();
  if (headers['cf-mitigated'] === 'challenge') return true;
  const servedByCloudflare = (headers['server'] ?? '').toLowerCase().includes('cloudflare');
  return servedByCloudflare && [401, 403, 429, 503].includes(response.status());
};

/** Titles / markers of Cloudflare challenge and block pages (status may be 200 on some of them). */
const BLOCK_PAGE_TITLE = /just a moment|attention required|access denied|sorry, you have been blocked/i;
const BLOCK_PAGE_MARKERS = ['#challenge-error-text', '#cf-error-details', '#challenge-stage', '.cf-error-overview'];

export const isCloudflareBlockPage = async (page: Page): Promise<boolean> => {
  if (BLOCK_PAGE_TITLE.test(await page.title())) return true;
  for (const marker of BLOCK_PAGE_MARKERS) {
    if ((await page.locator(marker).count()) > 0) return true;
  }
  return false;
};

/**
 * Skips the running test (with a visible reason in the report) when the page is a Cloudflare challenge.
 * The protection is never bypassed – the test simply cannot run in that environment.
 */
export const skipIfCloudflareChallenge = async (page: Page, response: Response | null): Promise<void> => {
  const blocked = isCloudflareChallenge(response) || (await isCloudflareBlockPage(page));
  test.skip(blocked, CLOUDFLARE_BLOCK_REASON);
};

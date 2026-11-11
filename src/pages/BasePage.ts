import { Page } from '@playwright/test';
import { CookieBanner } from '../components';
import { Route } from '../config/routes';
import { skipIfCloudflareChallenge } from '../utils';

/** Shared behaviour for all pages: navigation and site-wide components. */
export abstract class BasePage {
  readonly cookieBanner: CookieBanner;
  protected abstract readonly route: Route;

  protected constructor(readonly page: Page) {
    this.cookieBanner = new CookieBanner(page);
  }

  async open(): Promise<this> {
    const response = await this.page.goto(this.route, { waitUntil: 'domcontentloaded' });
    // Environment guard: if Cloudflare serves its challenge page, skip with a clear reason instead of timing out.
    skipIfCloudflareChallenge(response);
    await this.cookieBanner.acceptIfPresent();
    return this;
  }
}

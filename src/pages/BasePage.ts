import { Page } from '@playwright/test';
import { CookieBanner } from '../components';
import { Route } from '../config/routes';

/** Shared behaviour for all pages: navigation and site-wide components. */
export abstract class BasePage {
  readonly cookieBanner: CookieBanner;
  protected abstract readonly route: Route;

  protected constructor(readonly page: Page) {
    this.cookieBanner = new CookieBanner(page);
  }

  async open(): Promise<this> {
    await this.page.goto(this.route, { waitUntil: 'domcontentloaded' });
    await this.cookieBanner.acceptIfPresent();
    return this;
  }
}

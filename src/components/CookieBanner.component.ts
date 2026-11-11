import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { CookieBannerLocators as L } from '../locators';
import { TIMEOUT } from '../config/timeouts';

/** Cookie consent bar – appears on first visit and can overlay buttons on mobile. */
export class CookieBanner extends BaseComponent {
  readonly acceptAllButton;

  constructor(page: Page) {
    const accept = page.getByRole('button', { name: L.acceptAllButtonText });
    super(page, accept);
    this.acceptAllButton = accept;
  }

  /** Accepts cookies if the banner is shown; no-op otherwise. */
  async acceptIfPresent(): Promise<void> {
    try {
      await this.acceptAllButton.waitFor({ state: 'visible', timeout: TIMEOUT.optionalElement });
      await this.acceptAllButton.click();
    } catch {
      /* banner not rendered */
    }
  }
}

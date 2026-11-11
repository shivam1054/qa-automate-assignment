import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { ServicesMenuLocators as L } from '../locators';

/** Homepage "บริการ" (services) grid – contains the NokCash entry point. */
export class ServicesMenu extends BaseComponent {
  readonly nokCashButton: Locator;
  readonly nokCashLabel: Locator;

  constructor(page: Page) {
    super(page, page.getByTestId(L.root));
    this.nokCashButton = page.getByTestId(L.nokCashButton);
    this.nokCashLabel = this.root.getByText(L.nokCashLabelText, { exact: true });
  }

  async openNokCash(): Promise<void> {
    await this.nokCashButton.scrollIntoViewIfNeeded();
    await this.nokCashButton.click();
  }
}

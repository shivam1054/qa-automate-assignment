import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { LoginRequiredModalLocators as L } from '../locators';

/** Global "กรุณาล็อกอินเพื่อเข้าใช้งาน" modal shown when a guest opens a protected feature. */
export class LoginRequiredModal extends BaseComponent {
  readonly message: Locator;
  readonly cancelButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page, page.getByTestId(L.root));
    this.message = this.root.getByText(L.messageText);
    this.cancelButton = page.getByTestId(L.cancelButton);
    this.confirmButton = page.getByTestId(L.confirmButton);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }
}

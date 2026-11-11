import { Locator, Page, Request } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { LoginRequiredModalLocators as L } from '../locators';
import { isAuthUrlRequest } from '../utils';

/** Global "กรุณาล็อกอินเพื่อเข้าใช้งาน" modal shown when a guest opens a protected feature. */
export class LoginRequiredModal extends BaseComponent {
  readonly message: Locator;
  readonly cancelButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page, page.getByTestId(L.backdrop).filter({ hasText: L.messageText }));
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

  /** Confirms and returns the auth-URL API request the site fires to start LINE Login. */
  async confirmAndCaptureAuthRequest(): Promise<Request> {
    const request = this.page.waitForRequest(isAuthUrlRequest);
    await this.confirmButton.click();
    return request;
  }
}

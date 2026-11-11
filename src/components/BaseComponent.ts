import { Locator, Page } from '@playwright/test';

/**
 * A reusable UI fragment scoped to a root element.
 * Components expose locators and actions only – assertions live in specs.
 */
export abstract class BaseComponent {
  protected constructor(
    protected readonly page: Page,
    readonly root: Locator,
  ) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitUntilVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }
}

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { LotterySearchLocators as L } from '../locators';
import { LotteryType, SearchPattern } from '../types/lottery.types';
import { firstVisible } from '../utils';

/** 6-digit lottery search widget (homepage and lottoboard). */
export class LotterySearch extends BaseComponent {
  readonly searchButton: Locator;
  readonly randomButton: Locator;

  constructor(page: Page) {
    super(page, firstVisible(page.getByTestId(L.root)));
    this.searchButton = firstVisible(page.getByTestId(L.searchButton));
    this.randomButton = firstVisible(page.getByTestId(L.randomButton));
  }

  digitBox(index: number): Locator {
    return this.page.locator(L.digitBox(index));
  }

  typeButton(type: LotteryType): Locator {
    return firstVisible(this.page.getByTestId(L.typeButton(type)));
  }

  async selectType(type: LotteryType): Promise<void> {
    await this.typeButton(type).click();
  }

  /** Presses a single key into a given digit box. */
  async pressKey(index: number, key: string): Promise<void> {
    const box = this.digitBox(index);
    await box.click();
    await box.pressSequentially(key);
  }

  /**
   * Fills the boxes from a 6-char pattern ('*' = leave empty).
   * Each key goes into its own box because the widget auto-advances focus.
   */
  async enterNumber(pattern: SearchPattern): Promise<void> {
    if (pattern.length !== L.digitCount) {
      throw new Error(`Pattern must be ${L.digitCount} chars, got "${pattern}"`);
    }
    for (const [i, ch] of [...pattern].entries()) {
      if (ch !== '*') await this.pressKey(i, ch);
    }
  }

  async submit(): Promise<void> {
    await this.searchButton.click();
  }

  async random(): Promise<void> {
    await this.randomButton.click();
  }
}

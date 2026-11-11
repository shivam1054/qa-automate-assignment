import { test as base } from '@playwright/test';
import { HomePage, LottoboardPage, NokCashPage } from '../pages';

type PageFixtures = {
  homePage: HomePage;
  nokCashPage: NokCashPage;
  lottoboardPage: LottoboardPage;
};

/** Extends Playwright's `test` with ready-to-use page objects. */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  nokCashPage: async ({ page }, use) => use(new NokCashPage(page)),
  lottoboardPage: async ({ page }, use) => use(new LottoboardPage(page)),
});

export { expect } from '@playwright/test';

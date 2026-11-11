import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginRequiredModal } from '../components';
import { ROUTES } from '../config/routes';
import { NokCashLocators as L } from '../locators';

/**
 * NokCash top-up page (/nok-cash).
 * Guest behaviour only – the form is behind LINE login (see README).
 */
export class NokCashPage extends BasePage {
  protected readonly route = ROUTES.nokCash;

  readonly loginModal: LoginRequiredModal;
  readonly amountLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.loginModal = new LoginRequiredModal(page);
    this.amountLabel = page.getByText(L.amountLabelText);
  }
}

import { expect, Page, Request } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginRequiredModal, LotterySearch, ServicesMenu } from '../components';
import { ROUTES } from '../config/routes';
import { TIMEOUT } from '../config/timeouts';
import { LotteryType, SearchPattern } from '../types/lottery.types';
import { isLotterySearchRequest } from '../utils';

/** Homepage – composed of reusable components. */
export class HomePage extends BasePage {
  protected readonly route = ROUTES.home;

  readonly services: ServicesMenu;
  readonly lotterySearch: LotterySearch;
  readonly loginModal: LoginRequiredModal;

  constructor(page: Page) {
    super(page);
    this.services = new ServicesMenu(page);
    this.lotterySearch = new LotterySearch(page);
    this.loginModal = new LoginRequiredModal(page);
  }

  /**
   * Guest flow: click NokCash and wait for the login-required modal.
   * The button is server-rendered, so a click that lands before React hydration is ignored –
   * retry the click until the modal opens (synchronisation, not a test assertion).
   */
  async openNokCashAsGuest(): Promise<void> {
    await expect(async () => {
      await this.services.openNokCash();
      await this.loginModal.root.waitFor({ state: 'visible', timeout: 2_000 });
    }).toPass({ timeout: TIMEOUT.hydration });
  }

  /**
   * Business-level flow: search lottery by pattern and type.
   * Returns the search API request the page fires, so specs can verify the front-end contract.
   */
  async searchLottery(pattern: SearchPattern, type?: LotteryType): Promise<Request> {
    if (type) await this.lotterySearch.selectType(type);
    if (pattern) await this.lotterySearch.enterNumber(pattern);
    const request = this.page.waitForRequest(isLotterySearchRequest);
    await this.lotterySearch.submit();
    await this.page.waitForURL(/\/lottoboard/);
    return request;
  }

  async randomSearch(): Promise<Request> {
    const request = this.page.waitForRequest(isLotterySearchRequest);
    await this.lotterySearch.random();
    await this.page.waitForURL(/\/lottoboard/);
    return request;
  }
}

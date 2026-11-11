import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginRequiredModal, LotterySearch, ServicesMenu } from '../components';
import { ROUTES } from '../config/routes';
import { LotteryType, SearchPattern } from '../types/lottery.types';

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

  /** Business-level flow: search lottery by pattern and type. */
  async searchLottery(pattern: SearchPattern, type?: LotteryType): Promise<void> {
    if (type) await this.lotterySearch.selectType(type);
    if (pattern) await this.lotterySearch.enterNumber(pattern);
    await this.lotterySearch.submit();
    await this.page.waitForURL(/\/lottoboard/);
  }

  async randomSearch(): Promise<void> {
    await this.lotterySearch.random();
    await this.page.waitForURL(/\/lottoboard/);
  }
}

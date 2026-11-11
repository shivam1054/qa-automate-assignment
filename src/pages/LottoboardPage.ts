import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../config/routes';
import { LottoboardLocators as L } from '../locators';
import { firstVisible, getQueryParam } from '../utils';

/** Search results page (/lottoboard?type=...&number=...). */
export class LottoboardPage extends BasePage {
  protected readonly route = ROUTES.lottoboard;

  readonly board: Locator;
  readonly lotteryCards: Locator;
  readonly firstLotteryCard: Locator;
  readonly emptySearchText: Locator;
  /** Either a result card or the empty-state message – i.e. the search has completed. */
  readonly searchOutcome: Locator;

  constructor(page: Page) {
    super(page);
    this.board = page.getByTestId(L.board);
    this.lotteryCards = page.getByTestId(L.lotteryCard).filter({ visible: true });
    this.firstLotteryCard = firstVisible(page.getByTestId(L.lotteryCard));
    this.emptySearchText = page.getByTestId(L.emptySearchText);
    this.searchOutcome = this.firstLotteryCard.or(this.emptySearchText).first();
  }

  get typeParam(): string | null {
    return getQueryParam(this.page, 'type');
  }

  get numberParam(): string | null {
    return getQueryParam(this.page, 'number');
  }

  get searchTypeParam(): string | null {
    return getQueryParam(this.page, 'searchType');
  }
}

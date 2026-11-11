/** Search API called by the lottoboard page. */
export const LOTTERY_SEARCH_API_PATH = '/api/lotteries';

export const LottoboardLocators = {
  board: 'lottoboard',
  lotteryCard: 'lottery-card',
  addToCartButton: 'add-to-cart-button',
  /** Shown when no lottery matches: "ไม่พบเลข…ที่คุณค้นหา". */
  emptySearchText: 'empty-search-text',
} as const;

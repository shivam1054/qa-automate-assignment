/** Homepage selectors, grouped by component. */
export const ServicesMenuLocators = {
  root: 'nok-more-container',
  nokCashButton: 'nok-more-nok-cash-icon',
  nokCashLabelText: 'เติมนกแคช',
  nokPointButton: 'nok-more-nok-point-icon',
  nokShopButton: 'nok-more-nok-shop-icon',
} as const;

export const LotterySearchLocators = {
  root: 'lottery-search',
  /** Digit boxes use ids input-0 … input-5. */
  digitBox: (index: number) => `#input-${index}`,
  digitBoxAriaLabel: (position: number) => `กรอกตัวเลขลอตเตอรี่หลักที่ ${position}`,
  digitCount: 6,
  typeButton: (type: string) => `lottery-search-${type}-type-button`,
  searchButton: 'lottery-search-button',
  randomButton: 'lottery-search-random-button',
} as const;

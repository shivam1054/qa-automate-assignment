import { test, expect } from '../../../src/fixtures/test.fixture';
import { LotterySearchLocators as L } from '../../../src/locators';
import { INVALID_KEYS, TYPE_FILTERS, VALID_SEARCH_PATTERNS } from '../../../src/data/lottery-search.data';
import { LOTTERY_TYPE_PARAM } from '../../../src/types/lottery.types';
import { TAG } from '../../../src/data/tags';
import { TIMEOUT } from '../../../src/config/timeouts';
import { requestParam } from '../../../src/utils';

/**
 * Homepage lottery search (guest accessible).
 * Techniques: Equivalence Partitioning, Decision Table, Use Case.
 *
 * Search assertions verify the front-end contract: the lottoboard URL and the
 * GET /api/lotteries request the page sends. Rendering of results depends on the
 * live API (and on Cloudflare bot protection), so it is covered by a separate test.
 */
test.describe('Homepage lottery search', { tag: [TAG.search] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.lotterySearch.root).toBeVisible();
  });

  test('renders 6 numeric digit boxes with accessible labels', { tag: [TAG.smoke] }, async ({ homePage }) => {
    for (let i = 0; i < L.digitCount; i++) {
      const box = homePage.lotterySearch.digitBox(i);
      await expect(box).toBeVisible();
      await expect(box).toHaveAttribute('inputmode', 'numeric');
      await expect(box).toHaveAttribute('aria-label', L.digitBoxAriaLabel(i + 1));
    }
  });

  for (const { name, pattern, expected } of VALID_SEARCH_PATTERNS) {
    test(
      `EP valid | search by ${name} → number=${expected}`,
      { tag: [TAG.regression] },
      async ({ homePage, lottoboardPage }) => {
        const apiRequest = await homePage.searchLottery(pattern);

        expect(lottoboardPage.numberParam, 'lottoboard URL').toBe(expected);
        expect(requestParam(apiRequest, 'number'), 'search API request').toBe(expected);
      },
    );
  }

  test('EP invalid | digit boxes reject non-numeric keys', { tag: [TAG.negative] }, async ({ homePage }) => {
    const search = homePage.lotterySearch;
    for (const key of INVALID_KEYS) {
      await search.pressKey(0, key);
      await expect(search.digitBox(0), `key "${key}" should be rejected`).toHaveValue('');
    }
  });

  test('typing a digit auto-advances focus to the next box', { tag: [TAG.regression] }, async ({ homePage }) => {
    const search = homePage.lotterySearch;
    await search.pressKey(0, '7');

    await expect(search.digitBox(0)).toHaveValue('7');
    await expect(search.digitBox(1)).toBeFocused();
  });

  for (const { type, label } of TYPE_FILTERS) {
    test(
      `Decision table | type "${label}" → type=${LOTTERY_TYPE_PARAM[type]}`,
      { tag: [TAG.regression] },
      async ({ homePage, lottoboardPage }) => {
        const apiRequest = await homePage.searchLottery('', type);

        expect(lottoboardPage.typeParam, 'lottoboard URL').toBe(LOTTERY_TYPE_PARAM[type]);
        expect(requestParam(apiRequest, 'type'), 'search API request').toBe(LOTTERY_TYPE_PARAM[type]);
      },
    );
  }

  test(
    'random search "สุ่มตัวเลข" opens lottoboard in RANDOM mode',
    { tag: [TAG.smoke] },
    async ({ homePage, lottoboardPage }) => {
      const apiRequest = await homePage.randomSearch();

      expect(lottoboardPage.searchTypeParam).toBe('RANDOM');
      expect(apiRequest.url()).toContain('/api/lotteries');
    },
  );

  test(
    'search results or empty-state message are rendered',
    { tag: [TAG.regression] },
    async ({ homePage, lottoboardPage }) => {
      const apiRequest = await homePage.searchLottery('****56');
      const response = await apiRequest.response();

      // eslint-disable-next-line playwright/no-skipped-test -- conditional skip on a known environment block, not a disabled test
      test.skip(
        response?.status() === 403,
        'Search API returned 403 – Cloudflare bot protection blocks automated browsers. Needs a test environment or allow-listed runner.',
      );

      await expect(lottoboardPage.searchOutcome).toBeVisible({ timeout: TIMEOUT.searchResults });
    },
  );
});

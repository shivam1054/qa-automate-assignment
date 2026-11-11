import { test, expect } from '../../../src/fixtures/test.fixture';
import { LoginRequiredModalLocators as ModalText } from '../../../src/locators';
import { ENV } from '../../../src/config/env';
import { TIMEOUT } from '../../../src/config/timeouts';
import { TAG } from '../../../src/data/tags';
import { getHostname } from '../../../src/utils';

/**
 * Module 1 – Entry (Homepage → NokCash) for a guest user.
 * Traceability: TS-001, TS-002, TS-003, TS-004 (Assignment 2).
 */
test.describe('NokCash entry – guest user', { tag: [TAG.nokCash] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TS-001 | NokCash entry "เติมนกแคช" is visible and enabled', { tag: [TAG.smoke] }, async ({ homePage }) => {
    const { services } = homePage;
    await services.nokCashButton.scrollIntoViewIfNeeded();

    await expect(services.nokCashButton).toBeVisible();
    await expect(services.nokCashButton).toBeEnabled();
    await expect(services.nokCashLabel).toBeVisible();
  });

  test('TS-002 | Guest clicking NokCash sees the login-required modal', { tag: [TAG.smoke] }, async ({ homePage }) => {
    await test.step('Click NokCash entry', () => homePage.openNokCashAsGuest());

    await test.step('Login modal is displayed with both actions', async () => {
      const modal = homePage.loginModal;
      await expect(modal.root).toBeVisible();
      await expect(modal.message).toBeVisible();
      await expect(modal.cancelButton).toHaveText(ModalText.cancelText);
      await expect(modal.confirmButton).toHaveText(ModalText.confirmText);
    });
  });

  test(
    'TS-002a | Cancel on login modal keeps guest on homepage',
    { tag: [TAG.regression] },
    async ({ homePage, page }) => {
      await homePage.openNokCashAsGuest();

      await homePage.loginModal.cancel();

      await expect(homePage.loginModal.root).toBeHidden();
      await expect(page).toHaveURL(/\/$/);
    },
  );

  test(
    'TS-002b | Confirm on login modal redirects to LINE Login',
    { tag: [TAG.regression] },
    async ({ homePage, page }) => {
      await homePage.openNokCashAsGuest();

      const authRequest = await test.step('Confirm triggers the auth-URL API', () =>
        homePage.loginModal.confirmAndCaptureAuthRequest());

      const authResponse = await authRequest.response();

      // eslint-disable-next-line playwright/no-skipped-test -- conditional skip on a known environment block, not a disabled test
      test.skip(
        authResponse?.status() === 403,
        'Auth API returned 403 – Cloudflare bot protection blocks automated browsers. Needs a test environment or allow-listed runner.',
      );

      await test.step('Browser is redirected to LINE Login', async () => {
        // Only the redirect target is verified – no credentials are entered.
        // 'commit' = stop waiting as soon as the URL changes; the LINE page itself may load slowly.
        await page.waitForURL((url) => url.hostname === ENV.lineLoginHost, {
          timeout: TIMEOUT.externalRedirect,
          waitUntil: 'commit',
        });
        expect(getHostname(page)).toBe(ENV.lineLoginHost);
      });
    },
  );
});

test.describe('NokCash page – direct access', { tag: [TAG.nokCash, TAG.negative] }, () => {
  test('TS-003 | Opening /nok-cash as guest requires login', { tag: [TAG.smoke] }, async ({ nokCashPage }) => {
    await nokCashPage.open();

    await expect(nokCashPage.loginModal.root).toBeVisible();
    await expect(nokCashPage.loginModal.message).toBeVisible();
    await expect(nokCashPage.amountLabel, 'top-up form must not render without a session').toHaveCount(0);
  });
});

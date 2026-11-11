// Diagnostic: prints what this machine actually receives from the target site.
// Used in CI to tell "site blocked this runner" apart from "tests are broken".
import { chromium } from '@playwright/test';

const url = process.env.BASE_URL ?? 'https://xn--m3ca1athe9asc7b2b6iqe.com';
const browser = await chromium.launch();
const page = await browser.newPage();
try {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForTimeout(5_000);
  const h = res?.headers() ?? {};
  console.log('status      :', res?.status());
  console.log('final URL   :', page.url());
  console.log('server      :', h['server']);
  console.log('cf-mitigated:', h['cf-mitigated']);
  console.log('cf-ray      :', h['cf-ray']);
  console.log('title       :', await page.title());
  console.log('search box  :', await page.getByTestId('lottery-search').count());
  console.log('body text   :', (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 400));
} catch (e) {
  console.log('probe error :', e.message);
} finally {
  await browser.close();
}

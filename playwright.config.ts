import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/env';
import { TIMEOUT } from './src/config/timeouts';

export default defineConfig({
  testDir: './tests',
  timeout: TIMEOUT.test,
  expect: { timeout: TIMEOUT.expect },
  fullyParallel: true,
  forbidOnly: ENV.isCI,
  retries: ENV.isCI ? 2 : 1,
  // The site's API throttles bursts of parallel sessions; keep concurrency modest.
  workers: ENV.isCI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL: ENV.baseUrl,
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: TIMEOUT.action,
    navigationTimeout: TIMEOUT.navigation,
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});

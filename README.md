# QA Automation Assignment – ลอตเตอรี่พลัส.com

UI test automation for [ลอตเตอรี่พลัส.com](https://ลอตเตอรี่พลัส.com/) built with **Playwright + TypeScript** using the **Page Object Model (POM)**.

The scenarios are taken from _Assignment 2 – NokCash flow scenario design_ and cover every part of the flow that a **guest (not-logged-in) user** can reach, plus the homepage lottery search.

## Tech stack

| Item               | Choice                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| Language           | TypeScript (strict)                                                           |
| Test runner        | `@playwright/test`                                                            |
| Design pattern     | Page Object Model + Component Objects + custom fixtures                       |
| Browsers / devices | Desktop Chrome (1440×900) and Mobile Chrome (Pixel 7)                         |
| Code quality       | ESLint (typescript-eslint + eslint-plugin-playwright), Prettier, EditorConfig |
| Reporting          | List, HTML, JUnit XML; trace / screenshot / video on failure                  |
| CI                 | GitHub Actions – typecheck → lint → test → upload report                      |

## Project structure

```
.
├── playwright.config.ts            # projects, reporters, timeouts (reads src/config)
├── src
│   ├── config/                     # env.ts (BASE_URL), routes.ts, timeouts.ts
│   ├── locators/                   # ALL selectors, one file per page/area – no selectors elsewhere
│   │   ├── common.locators.ts      #   cookie banner, login-required modal
│   │   ├── home.locators.ts        #   services menu, lottery search
│   │   ├── lottoboard.locators.ts
│   │   └── nok-cash.locators.ts
│   ├── components/                 # reusable UI fragments (BaseComponent + children)
│   │   ├── CookieBanner.component.ts
│   │   ├── LoginRequiredModal.component.ts
│   │   ├── ServicesMenu.component.ts     # NokCash entry point
│   │   └── LotterySearch.component.ts
│   ├── pages/                      # pages compose components + business-level flows
│   │   ├── BasePage.ts             #   open(), shared components
│   │   ├── HomePage.ts
│   │   ├── NokCashPage.ts
│   │   └── LottoboardPage.ts
│   ├── fixtures/test.fixture.ts    # injects page objects into tests
│   ├── data/                       # test data (EP classes, decision table) + tags
│   ├── types/                      # domain types (LotteryType, query-param map)
│   └── utils/                      # URL helpers, visible-element helper
└── tests/e2e
    ├── home/lottery-search.spec.ts
    └── nok-cash/nok-cash-entry.spec.ts
```

### Layering

```
spec  ──uses──▶  fixture  ──creates──▶  Page  ──composes──▶  Component  ──reads──▶  Locators
 (assertions)                           (flows)              (actions)              (selectors only)
```

- **Locators** – plain constant maps of `data-testid` values and Thai labels. A UI change means editing one file.
- **Components** – scoped to a root element, expose locators + atomic actions; reused across pages (e.g. `LoginRequiredModal` on Home and NokCash pages).
- **Pages** – compose components and expose business flows (`searchLottery()`, `randomSearch()`). No assertions.
- **Specs** – assertions only, grouped with `test.step`, data-driven from `src/data`, tagged for selective runs.
- The site renders separate desktop/mobile copies of some widgets; `utils/firstVisible()` picks the visible one, so the same specs run on both viewports.

### Stability decisions

- **Hydration-safe clicks** – the homepage is server-rendered; a click that lands before React hydrates is ignored. `HomePage.openNokCashAsGuest()` retries the click (`expect.toPass`) until the login modal opens, instead of using fixed sleeps.
- **Contract-level search assertions** – search specs verify the lottoboard URL _and_ the `GET /api/lotteries` request the page sends (`type`, `number`), so they don't depend on live stock or backend availability.
- **Cloudflare bot protection** – the site's Cloudflare challenge intermittently returns `403` to `/api/lotteries` and `/api/auth/get-url` for automated browsers. The two tests that depend on those responses (rendered results, LINE redirect) first verify the request was sent, then skip themselves with a clear reason when that happens, instead of failing. No attempt is made to bypass the protection; in a real project the fix is a test environment or an allow-listed CI runner.
- **CI and Cloudflare** – GitHub-hosted runners (US data-centre IPs) are refused by the site's Cloudflare WAF – the CI probe step shows `401` with an empty `{}` body instead of the homepage. `BasePage.open()` detects this (`cf-mitigated: challenge` header, or a 401/403/429/503 served by Cloudflare) and skips the test with an explicit reason, so CI reports _blocked_ rather than _broken_. Typecheck and lint still run in CI on every push; run the E2E suite locally (or on a Thai / allow-listed runner) for real results.
- **Modal anchoring** – the login modal's inner container has a different `data-testid` per page (`global-modal` on Home, `option-modal` on /nok-cash), so the component anchors on the shared `modal-backdrop` + message text.
- **Modest parallelism** – the site's API throttles bursts of parallel sessions, so workers are capped at 3 locally / 2 in CI.

## Automated scenarios

| Spec           | Test                                                                                 | Scenario ID (Assignment 2) | Technique                      | Tags             |
| -------------- | ------------------------------------------------------------------------------------ | -------------------------- | ------------------------------ | ---------------- |
| nok-cash-entry | NokCash entry "เติมนกแคช" visible & enabled                                          | TS-001 / TS-004            | Use case, responsive           | @smoke           |
| nok-cash-entry | Guest clicks NokCash → login-required modal                                          | TS-002                     | Decision table (logged-in = N) | @smoke           |
| nok-cash-entry | Cancel ("ยกเลิก") keeps guest on homepage                                            | TS-002                     | State transition               | @regression      |
| nok-cash-entry | Confirm ("ตกลง") redirects to LINE Login                                             | TS-002                     | State transition               | @regression      |
| nok-cash-entry | Direct `/nok-cash` as guest requires login, form not rendered                        | TS-003                     | Error guessing / security      | @smoke @negative |
| lottery-search | 6 numeric digit boxes with accessible labels                                         | –                          | UI / accessibility             | @smoke           |
| lottery-search | Valid patterns (6 digits, last 2, last 3, first 3) → `number` in URL and API request | –                          | Equivalence partitioning       | @regression      |
| lottery-search | Non-numeric keys (a, Z, ก, -, ., @) rejected                                         | –                          | EP (invalid class)             | @negative        |
| lottery-search | Typing a digit auto-advances focus                                                   | –                          | Use case                       | @regression      |
| lottery-search | ทั้งหมด / หวยเดี่ยว / หวยชุด → `type` param                                          | –                          | Decision table                 | @regression      |
| lottery-search | Random search returns results                                                        | –                          | Use case                       | @smoke           |

17 tests × 2 projects = **34 test runs**.

## Out of scope (and why)

The NokCash top-up page and payment page (TS-005 – TS-054) are protected by **LINE-only login** (OAuth at `access.line.me`). Automating a third-party OAuth login is not reliable or appropriate in a public repo (2FA, captcha, credentials). In a real project these scenarios would be automated by:

1. Logging in once manually and saving the session with Playwright `storageState` (kept out of git), or
2. Using a test-environment API / back-door login to create an authenticated session.

The POM structure is ready for this: new `TopUpForm` and `OrderSummary` components (with their own locator files) would be composed into `NokCashPage` and a new `PaymentPage`, covering the amount EP/BVA cases and the order-summary checks (TS-030 / TS-031).

No test creates orders, uploads slips or spends money.

## How to run

Requirements: Node.js 18+.

```bash
npm install
npx playwright install chromium

npm test                  # all tests, desktop + mobile
npm run test:smoke        # @smoke only
npm run test:regression   # @regression only
npm run test:desktop      # desktop only
npm run test:mobile       # mobile only
npm run test:headed       # watch it run in a browser
npm run test:debug        # Playwright inspector
npm run report            # open the HTML report

npm run typecheck         # TypeScript
npm run lint              # ESLint
npm run format            # Prettier
```

Run against a different environment: `BASE_URL=https://staging.example.com npm test`

> Note: the site is an IDN domain; the config uses its punycode form `https://xn--m3ca1athe9asc7b2b6iqe.com`.

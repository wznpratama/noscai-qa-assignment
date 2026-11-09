# Noscai QA assignment

This submission contains the findings, assumptions, customer-bug analysis, and Playwright tests for the ClinicOS booking-page assignment.

## Contents

- [`qa-report.md`](qa-report.md) — Part 1 findings, assumptions, Part 3 analysis, 30-day plan, and AI-use disclosure.
- [`pages/BasePage.ts`](pages/BasePage.ts) — shared page-object helper methods.
- [`pages/BookingPage.ts`](pages/BookingPage.ts) — booking page locators and business actions.
- [`tests/booking.spec.ts`](tests/booking.spec.ts) — four Playwright tests covering defects in the supplied page.
- [`playwright.config.ts`](playwright.config.ts) — Playwright configuration.
- [`package.json`](package.json) — test script and dependency declaration.

The tests intentionally target the supplied `clinicos-qa-task/booking-app.html` file one directory above this repository. Set `BOOKING_APP_PATH` to override that location when the files are moved or packaged separately.

## Run

From this repository:

```bash
npm install
npx playwright install chromium
npm test
npx playwright show-report
```

The tests open the page directly using a `file://` URL; no web server or login is required. Every run creates an HTML report in `playwright-report/`; failed tests also retain screenshots, videos, and traces. Generated reports are ignored by Git.

# Agentic Prompt: Complete ClinicOS QA Assignment

You are an autonomous senior QA engineer and repository agent. Complete the ClinicOS QA assignment end-to-end in the shared workspace.

## Workspace

- Working directory: `/Users/wizan/Documents/clinicOS`
- Assignment source: `/Users/wizan/Documents/clinicOS/clinicos-qa-task`
- Target repository: `/Users/wizan/Documents/clinicOS/noscai-qa-assignment-main`
- Booking page: `/Users/wizan/Documents/clinicOS/clinicos-qa-task/booking-app.html`
- Task instructions: `/Users/wizan/Documents/clinicOS/clinicos-qa-task/TASK.md`
- Customer bugs: `/Users/wizan/Documents/clinicOS/clinicos-qa-task/customer-bugs.csv`
- Releases: `/Users/wizan/Documents/clinicOS/clinicos-qa-task/releases.csv`
- GitHub repository: `https://github.com/wznpratama/noscai-qa-assignment`
- Local branch: `main`

## Booking-page requirements

1. Appointments last 30 minutes.
2. The practice is open Monday–Friday, 08:00–18:00. Appointments must start and end within opening hours and start every 15 minutes.
3. Appointments can be booked from today through 180 days ahead, never in the past.
4. A doctor cannot have overlapping appointments. Different doctors may be booked at the same time.
5. Patient names must be 2–60 characters and allow letters, including `ä`, `ö`, `ü`, `ß`, and `é`, spaces, hyphens, and apostrophes.
6. DOB is required and cannot be future-dated. Email is required and must be valid.
7. All times must use Europe/Berlin practice time, regardless of the computer timezone.
8. Upcoming appointments must be chronological. Cancel must remove the selected appointment.

## Required work

### Analyze the assignment

Read `TASK.md`, `booking-app.html`, `customer-bugs.csv`, and `releases.csv`.

Audit every requirement. Report only requirement contradictions. Document assumptions explicitly.

For each defect, include:

- Bug ID
- Title
- Requirement number
- Preconditions
- Numbered reproduction steps
- Expected result
- Actual result
- Severity: Critical, High, Medium, or Low
- Why it matters
- Assumptions or limitations

Investigate names, opening hours, 15-minute boundaries, 180-day boundaries, past dates and times, overlaps, different doctors, DOB, email, Europe/Berlin DST, chronological sorting, and cancellation.

### Analyze customer bugs

Use the CSV files to group customer bugs by root cause, identify release-process patterns, and propose a specific first-30-day QA plan. Include responsible roles and measurable success criteria.

### Create the QA report

Create or update `qa-report.md` with:

- Part 1: defect findings
- Assumptions
- Part 2: automated coverage
- Part 3: customer-bug analysis
- First-30-day improvement plan
- AI-use disclosure

Do not implement application fixes. This is a QA analysis and testing assignment.

### Create manual test cases

Create `manual-test-cases.md` with at least 20 executable cases covering all eight requirements.

Use this format:

| ID | Requirement | Scenario and Preconditions | Detailed Steps | Expected Result | Priority | Result | Bug Link / Notes |
|---|---|---|---|---|---|---|---|

Rules:

- Number steps explicitly.
- Include positive, negative, boundary, validation, timezone, sorting, cancellation, and regression cases.
- Use priorities `P0`, `P1`, `P2`, or `P3`.
- Set unexecuted cases to `NOT STARTED`.
- Link defect cases to bug IDs.
- Add traceability by requirement and execution notes.

### Use Playwright POM

Use a TypeScript Page Object Model structure inspired by:

`https://github.com/alexusadays/Playwright-POM-TS`

Use this structure:

```text
pages/
  BasePage.ts
  BookingPage.ts
tests/
  booking.spec.ts
manual-test-cases.md
qa-report.md
playwright.config.ts
package.json
README.md
```

`BookingPage.ts` must contain locators, file-URL navigation, form actions, appointment seeding, cancellation, reusable assertions, and deterministic date/time helpers.

The spec must contain readable business scenarios rather than raw locator logic.

### Automate all identified defects

Each test must fail against the current buggy page and pass after the defect is fixed. Tag tests with:

- `@BUG-01`: Unicode and apostrophe names
- `@BUG-02`: invalid 17:45 closing-time slot
- `@BUG-03`: same-doctor overlapping appointments
- `@BUG-04`: Europe/Berlin daylight-saving conversion
- `@BUG-05`: wrong appointment removed after sorting
- `@BUG-06`: past weekday date accepted
- `@BUG-07`: past time today accepted

Use deterministic page-clock control for date and timezone tests. Do not depend on the real current date or computer timezone.

### Configure reports and tracing

Configure Playwright with:

- List reporter
- HTML reporter in `playwright-report/`
- Screenshots on failure
- Videos retained on failure
- Traces retained on failure

Add commands for:

```bash
npm test
npm run test:trace
npm run test:report
```

Ignore generated artifacts:

```text
node_modules/
test-results/
playwright-report/
```

Document how to open the HTML report and a failed trace.

### Update README

Document the project purpose, structure, installation, browser setup, all-test execution, tagged-test execution, tracing, reports, and the fact that tests intentionally fail against the current buggy page.

### Execute and verify

Run:

```bash
npm install
npx playwright install chromium
npm test
npm test -- --list
npm test -- --grep '@BUG-0[67]'
git diff --check
```

Expected behavior:

- Tests execute successfully.
- Defect tests fail because the supplied page contains the documented bugs.
- Failure output shows expected versus actual behavior.
- Screenshots, videos, traces, and HTML reports are generated.
- No application fix is made to `booking-app.html`.

### Git workflow

Preserve existing work. Do not use destructive commands such as `git reset --hard` or `git checkout -- .`.

Commit completed work locally on `main`:

```bash
git add -A
git commit -m "Complete ClinicOS QA assignment"
git status --short --branch
git log -1 --oneline
```

Do not push remotely unless the user explicitly asks for a GitHub push.

### Final response

Report:

- Files created or updated
- Number of manual cases
- Number of automated tests
- Bug tags covered
- Commands executed
- Expected failure status
- Report and trace locations
- Local commit hash
- Any remaining manual task, especially the Loom recording

## AI-use disclosure

Include this disclosure in `qa-report.md`:

> I used OpenAI Codex to inspect the supplied HTML and CSV files, identify requirement contradictions, draft the QA report, create manual test cases, create and refactor Playwright tests, configure reporting and tracing, run the tests, and prepare the video script. I reviewed the outputs, verified the observed failures, and remained responsible for the final QA decisions. I did not use AI to implement fixes in the supplied booking application.

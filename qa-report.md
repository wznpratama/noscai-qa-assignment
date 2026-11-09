# QA report — ClinicOS booking page

## Part 1 — defects

### BUG-01 — Patient names with supported letters or apostrophes are rejected

**Severity:** High — valid patient records cannot be booked, including names explicitly allowed by requirement 5.

**Steps:** Open the page; enter `Chloë D'Souza` as Patient name; enter any valid past DOB and email; choose a doctor, reason, future weekday, and `09:00`; click **Book appointment**.

**Expected:** The appointment is booked because requirement 5 allows letters including `ë`, spaces, hyphens, and apostrophes; the name is 2–60 characters. **Actual:** `Please enter a valid name.` is shown and no appointment is added.

### BUG-02 — A 17:45 appointment can end after closing

**Severity:** High — it allows an appointment outside the stated 08:00–18:00 opening window and can create an impossible reception schedule.

**Steps:** Complete the form with valid data; choose a future weekday; select `17:45`; submit.

**Expected:** The latest allowed start is `17:30`, because the 30-minute appointment must end by 18:00 (requirements 1–2). **Actual:** `17:45` is offered and accepted, producing an appointment that ends at 18:15.

### BUG-03 — Overlapping appointments for one doctor are accepted

**Severity:** High — it violates requirement 4 and can assign two patients to the same doctor simultaneously.

**Steps:** Book or seed a doctor appointment at `09:00`; submit another appointment for the same doctor, same date, at `09:15`.

**Expected:** The second booking is rejected because the 30-minute intervals overlap (requirement 4). **Actual:** It is accepted; the validation only compares equal start timestamps.

### BUG-04 — Berlin daylight-saving time is handled with a fixed UTC+01 offset

**Severity:** High — appointments on summer-time dates can be shown one hour away from the selected practice time, contradicting requirement 7.

**Steps:** On a machine in a non-Berlin time zone, choose a valid summer date such as `2027-06-15` and `09:00`; submit.

**Expected:** The appointment remains `09:00` Europe/Berlin (requirement 7). **Actual:** the page parses the selected time using a hard-coded `+01:00`; on a CEST date it represents 10:00 Berlin and the confirmation/list can show `10:00`.

### BUG-05 — Cancel can remove a different appointment than the selected row

**Severity:** Critical — the wrong patient can be cancelled, which is destructive and conflicts with requirement 8.

**Steps:** Seed two appointments in reverse insertion order: a later appointment first and an earlier appointment second; reload; click **Cancel** on the first (earliest) displayed row.

**Expected:** The selected earlier appointment is removed and the later appointment remains (requirement 8). **Actual:** The displayed rows are sorted, but the handler splices the unsorted array by displayed index, so the later appointment is removed.

## Assumptions

- “Every appointment must start and end within opening hours” means a 30-minute appointment starting at 17:30 is the latest valid slot; 17:45 is invalid.
- “Appointments start every 15 minutes” means the permitted start times are 08:00 through 17:30 in 15-minute increments.
- Requirement 7 applies both to parsing a selected date/time and to rendering seeded/stored appointments; Europe/Berlin’s historical/future DST rules must determine the offset rather than a fixed offset.
- The supplied page has no public-holiday requirement, so holidays are not reported as defects.

## Part 3 — customer-bug analysis

There are 13 customer bugs. The dominant pattern is **time-zone and calendar correctness**: reminders, booking confirmation, and iCal export each mishandle clock changes (BUG-2104, 2107, 2290, 2291). This is 4/13 bugs and includes 3 High-severity/open or recurring failures. The underlying cause is fixed-offset time handling instead of one timezone-aware representation and DST boundary tests.

The second group is **booking and patient-data validation / domain rules**: apostrophes, public holidays, international phone formats, and overlapping appointments (BUG-2161, 2188, 2203, 2252). These are 4/13. The cause is underspecified stories and validation implemented from narrow examples rather than explicit domain rules and representative data.

The third group is **regressions caused by risky hotfixes and weak release gates**: the week filter, wrong cancellation, and large-practice day view (BUG-2231, 2249, 2296). These are 3/13; all followed releases whose regression suite was skipped or reduced to smoke-only coverage. The final group is **low-risk content quality**, represented by the invoice typo (BUG-2302), which escaped a basic document/content check.

### First 30 days

1. **QA lead + product managers:** turn each calendar, validation, and cancellation rule into acceptance criteria with examples and explicit timezone/holiday scope. Add a domain-risk checklist to refinement and require QA sign-off for ambiguous stories.
2. **QA automation engineer:** create a parameterized regression pack for DST transitions in Europe/Berlin, UTC/browser timezone permutations, 30-minute overlap boundaries, international names/phones, holidays, sorted-list actions, and large-practice data. Run it on every PR and nightly.
3. **Developers:** centralize timezone conversion and appointment interval logic; add unit tests around DST and overlap boundaries. Use stable appointment IDs for row actions, never visual array positions.
4. **Release manager:** prohibit “smoke only” hotfix releases for calendar, booking, or destructive actions unless the impacted regression slice passes. Use a risk-based minimum gate and require a rollback plan.
5. **QA lead:** baseline the current suite and track escaped defects by root cause, module, and release. Success after 30 days is: all new calendar/booking changes pass the new slice, no escaped P0/P1 defects in those areas, no defect caused by a previously fixed case, and 100% of hotfixes record the relevant regression evidence.

## AI-use disclosure

I used OpenAI Codex to inspect the supplied HTML/CSV files, identify requirement contradictions, draft this report, and create the Playwright tests. The evidence and test assertions were reviewed against the page source and assignment requirements; no external product behavior was assumed.

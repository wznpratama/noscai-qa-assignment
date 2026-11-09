# ClinicOS Booking Page — Manual Test Cases

## Document control

| Field | Value |
|---|---|
| Product | Lindenhof Family Practice booking page |
| Scope | Requirements 1–8 from `clinicos-qa-task/TASK.md` |
| Test type | Manual functional, validation, boundary, regression, and data-integrity testing |
| Environment | Chrome; test the timezone cases with the computer timezone set away from Europe/Berlin |
| Test data reset | Use **Reset demo data** before each independent scenario where noted |
| Result values | `NOT STARTED`, `PASSED`, `FAILED`, `BLOCKED`, `SKIPPED` |
| Current execution status | All cases are `NOT STARTED` |

## Test data

- Valid patient: `Maria Müller`, DOB `1980-01-01`, email `maria@example.com`
- International patient: `Chloë D'Souza`
- Valid future weekday: choose the next available weekday shown by the page
- Past weekday: choose a known previous weekday
- Doctors: Dr. Anna Weber and Dr. Murat Yılmaz
- Reasons: any available reason, such as `Check-up`

## Manual test cases

| ID | Requirement | Scenario and preconditions | Detailed steps | Expected result | Priority | Result | Bug link / notes |
|---|---|---|---|---|---|---|---|
| MTC-001 | 1, 2 | Verify the first opening slot is bookable. Reset demo data. | 1. Enter valid patient, DOB, email, doctor, and reason. 2. Select a valid weekday. 3. Select `08:00`. 4. Click **Book appointment**. | The appointment is created successfully. The selected slot represents a 30-minute appointment from 08:00 to 08:30. | P1 | NOT STARTED | Confirm the page does not expose an end time; validate through the stated duration rule. |
| MTC-002 | 1, 2 | Verify the latest valid slot ends at closing time. Reset demo data. | 1. Complete the form with valid data. 2. Select a valid weekday. 3. Select `17:30`. 4. Submit. | The appointment is created. `17:30` is accepted because the 30-minute appointment ends exactly at 18:00. | P1 | NOT STARTED | Boundary case. |
| MTC-003 | 1, 2 | Verify a slot ending after closing is rejected. Reset demo data. | 1. Complete the form with valid data. 2. Select a valid weekday. 3. Select `17:45`. 4. Submit. | The slot is unavailable or the booking is rejected because the appointment would end at 18:15. No appointment is created. | P1 | NOT STARTED | `BUG-02`. |
| MTC-004 | 2 | Verify weekday and weekend availability. Reset demo data. | 1. Select a Monday–Friday date and inspect the time list. 2. Select a Saturday date. 3. Submit valid data. 4. Repeat with a Sunday date. | Weekday booking is available. Saturday and Sunday are rejected with no appointment created. | P1 | NOT STARTED | Requirement does not mention public holidays; do not treat holidays as a failure. |
| MTC-005 | 2 | Verify 15-minute start increments. Reset demo data. | 1. Open the time selector. 2. Review every listed time from the first to last slot. | Times progress in exactly 15-minute increments: 08:00, 08:15, 08:30, and so on through 17:30. No invalid 17:45 slot is available. | P1 | NOT STARTED | `BUG-02`. |
| MTC-006 | 3 | Verify today and the maximum future date. Reset demo data. | 1. Select today and a future valid time. 2. Submit valid data. 3. Select the date exactly 180 days from today. 4. Submit valid data. | Today and the 180th day are accepted when they are otherwise valid booking dates. | P1 | NOT STARTED | Use Europe/Berlin practice date when determining “today”. |
| MTC-007 | 3 | Verify dates before today are rejected. Reset demo data. | 1. Select a previous weekday date. 2. Complete all other fields with valid data. 3. Submit. | The booking is rejected as being in the past. No appointment is created. | P1 | NOT STARTED | `BUG-06`. |
| MTC-008 | 3 | Verify dates beyond the 180-day limit are rejected. Reset demo data. | 1. Select a date 181 days from today. 2. Complete all other fields with valid data. 3. Submit. | The booking is rejected because appointments can be booked no more than 180 days ahead. | P1 | NOT STARTED | Boundary case. |
| MTC-009 | 3 | Verify an earlier time today is rejected. Reset demo data. | 1. Determine the current Europe/Berlin time. 2. Select today. 3. Select a slot earlier than the current practice time. 4. Submit valid data. | The booking is rejected because the selected appointment is in the past. No appointment is created. | P1 | NOT STARTED | `BUG-07`; run when at least one earlier slot exists. |
| MTC-010 | 4 | Verify the same doctor cannot have overlapping appointments. Seed or book an appointment at 09:00 for Dr. Weber. | 1. Start a second booking for Dr. Weber on the same date at 09:15. 2. Complete valid patient details. 3. Submit. | The second appointment is rejected because the 30-minute intervals overlap. | P1 | NOT STARTED | `BUG-03`. |
| MTC-011 | 4 | Verify adjacent appointments for the same doctor are allowed. Seed or book an appointment at 09:00 for Dr. Weber. | 1. Start a second booking for Dr. Weber on the same date at 09:30. 2. Complete valid patient details. 3. Submit. | The second appointment is accepted because the first ends at 09:30 and the intervals do not overlap. | P1 | NOT STARTED | Boundary case. |
| MTC-012 | 4 | Verify different doctors can be booked at the same time. Seed or book Dr. Weber at 09:00. | 1. Book Dr. Yılmaz on the same date at 09:00. 2. Complete valid patient details. 3. Submit. | The second appointment is accepted because doctors are different. | P1 | NOT STARTED | Positive concurrency case. |
| MTC-013 | 5 | Verify supported patient-name characters. Reset demo data. | 1. Enter `Chloë D'Souza`. 2. Complete the remaining fields with valid data. 3. Submit. 4. Repeat with a hyphenated name such as `Anne-Marie Müller`. | Both names are accepted and stored/displayed without modification. | P1 | NOT STARTED | `BUG-01`. |
| MTC-014 | 5 | Verify patient-name length boundaries. Reset demo data. | 1. Enter a valid name with exactly 2 characters. 2. Submit valid booking data. 3. Repeat with exactly 60 allowed characters. 4. Repeat with 1 character and then 61 characters. | Names of 2 and 60 characters are accepted. Names shorter than 2 or longer than 60 are rejected. | P2 | NOT STARTED | Include spaces, hyphens, and apostrophes only in otherwise valid test data. |
| MTC-015 | 6 | Verify DOB is required and cannot be in the future. Reset demo data. | 1. Leave DOB empty and submit the otherwise valid form. 2. Enter tomorrow’s date as DOB and submit. 3. Enter a valid past DOB and submit. | Empty and future DOB values are rejected. A valid past DOB is accepted. | P1 | NOT STARTED | Requirement 6. |
| MTC-016 | 6 | Verify email is required and validated. Reset demo data. | 1. Leave email empty and submit. 2. Enter `invalid-email` and submit. 3. Enter `patient@example.com` and submit. | Empty and malformed email values are rejected. The valid email is accepted. | P1 | NOT STARTED | Requirement 6. |
| MTC-017 | 7 | Verify displayed times use Europe/Berlin time. Set the computer/browser timezone to a non-Berlin timezone. Reset demo data. | 1. Freeze or choose a known winter date and book 09:00. 2. Observe the confirmation and appointment list. 3. Repeat on a summer-time date. | The selected and displayed time remains the Europe/Berlin practice time regardless of the computer timezone. | P1 | NOT STARTED | `BUG-04`; verify both winter CET and summer CEST behavior. |
| MTC-018 | 8 | Verify upcoming appointments are chronological. Seed appointments in reverse order. | 1. Add appointments at 14:00 and 09:00. 2. Reload the page. 3. Inspect the list. | The 09:00 appointment appears before the 14:00 appointment, regardless of insertion order. | P1 | NOT STARTED | Positive sorting case. |
| MTC-019 | 8 | Verify Cancel removes the selected appointment. Seed a later appointment first and an earlier appointment second. | 1. Reload the page. 2. Click **Cancel** on the first displayed row. 3. Confirm the resulting list and cancellation message. | Only the selected appointment is removed. The other appointment remains and the cancellation message identifies the selected patient. | P0 | NOT STARTED | `BUG-05`; destructive data-integrity case. |
| MTC-020 | 8 | Verify the list state after cancelling the last appointment. Seed one appointment. | 1. Click **Cancel**. 2. Inspect the appointment section. | The appointment is removed, the empty-state message is shown, and no stale row remains after reload. | P2 | NOT STARTED | Regression case. |

## Traceability summary

| Requirement | Manual test cases |
|---|---|
| 1. 30-minute duration | MTC-001, MTC-002, MTC-003 |
| 2. Opening hours and 15-minute starts | MTC-002, MTC-003, MTC-004, MTC-005 |
| 3. Booking window and no past appointments | MTC-006, MTC-007, MTC-008, MTC-009 |
| 4. Doctor overlap rules | MTC-010, MTC-011, MTC-012 |
| 5. Patient name rules | MTC-013, MTC-014 |
| 6. DOB and email validation | MTC-015, MTC-016 |
| 7. Europe/Berlin display time | MTC-017 |
| 8. Sorting and cancellation | MTC-018, MTC-019, MTC-020 |

## Execution notes

- Record the actual result and evidence link/screenshot when executing a case.
- Use **Reset demo data** between cases that modify local storage.
- For date-boundary cases, write down the practice date and current Europe/Berlin time used during execution.
- Do not mark a case `PASSED` or `FAILED` until it has been manually executed.

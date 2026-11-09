import { test } from '@playwright/test';
import { Appointment, BookingPage } from '../pages/BookingPage';

test('@BUG-01 accepts valid Unicode and apostrophe patient names', async ({ page }) => {
  const bookingPage = new BookingPage(page);
  await bookingPage.open();
  await bookingPage.fillForm({ name: "Chloë D'Souza" });
  await bookingPage.book();

  await bookingPage.expectNameError('');
  await bookingPage.expectRowsContain("Chloë D'Souza");
});

test('@BUG-02 rejects a start time that would end after closing', async ({ page }) => {
  const bookingPage = new BookingPage(page);
  await bookingPage.open();
  await bookingPage.fillForm({ time: '17:45' });
  await bookingPage.book();

  await bookingPage.expectTimeError('opening hours');
});

test('@BUG-03 rejects overlapping appointments for the same doctor', async ({ page }) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while ([0, 6].includes(date.getDay())) date.setDate(date.getDate() + 1);
  const dateValue = date.toISOString().slice(0, 10);
  const existing: Appointment[] = [{
    id: 'A-1001', patient: 'Existing Patient', dob: '1980-01-01', email: 'existing@example.com',
    doctor: 'weber', reason: 'Check-up', start: Date.parse(`${dateValue}T09:00:00+01:00`),
  }];

  const bookingPage = new BookingPage(page);
  await bookingPage.open(existing);
  await bookingPage.fillForm({ date: dateValue, time: '09:15' });
  await bookingPage.book();

  await bookingPage.expectTimeError('already has an appointment');
});

test('@BUG-04 preserves Europe/Berlin time during summer daylight saving time', async ({ page }) => {
  await page.addInitScript(() => {
    const fixedNow = Date.parse('2026-01-15T12:00:00Z');
    Date.now = () => fixedNow;
  });
  const bookingPage = new BookingPage(page);
  await bookingPage.open();
  await bookingPage.fillForm({ date: '2026-04-15', time: '09:00' });
  await bookingPage.book();

  await bookingPage.expectAppointmentTime('09:00');
});

test('@BUG-05 cancels the appointment represented by the selected sorted row', async ({ page }) => {
  const appointments: Appointment[] = [
    { id: 'A-1002', patient: 'Later Patient', dob: '1980-01-01', email: 'later@example.com', doctor: 'weber', reason: 'Check-up', start: Date.parse('2030-01-15T14:00:00+01:00') },
    { id: 'A-1001', patient: 'Earlier Patient', dob: '1980-01-01', email: 'earlier@example.com', doctor: 'yilmaz', reason: 'Vaccination', start: Date.parse('2030-01-15T09:00:00+01:00') },
  ];

  const bookingPage = new BookingPage(page);
  await bookingPage.open(appointments);
  await bookingPage.cancelFirstAppointment();

  await bookingPage.expectRowCount(1);
  await bookingPage.expectRowsContain('Later Patient');
});

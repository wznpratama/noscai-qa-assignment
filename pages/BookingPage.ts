import { expect, Page } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BasePage } from './BasePage';

export type Appointment = {
  id: string; patient: string; dob: string; email: string;
  doctor: string; reason: string; start: number;
};

export type BookingDetails = Partial<{
  name: string; dob: string; email: string; doctor: string;
  reason: string; date: string; time: string;
}>;

export class BookingPage extends BasePage {
  private static readonly storageKey = 'lindenhof.appointments.v1';
  private readonly appPath = process.env.BOOKING_APP_PATH ?? path.resolve(__dirname, '../../clinicos-qa-task/booking-app.html');

  readonly patientName = this.page.locator('[data-testid="patient-name"]');
  readonly dateOfBirth = this.page.locator('[data-testid="dob"]');
  readonly email = this.page.locator('[data-testid="email"]');
  readonly doctor = this.page.locator('[data-testid="doctor"]');
  readonly reason = this.page.locator('[data-testid="reason"]');
  readonly date = this.page.locator('[data-testid="date"]');
  readonly time = this.page.locator('[data-testid="time"]');
  readonly bookButton = this.page.locator('[data-testid="book-button"]');
  readonly nameError = this.page.locator('[data-testid="error-name"]');
  readonly timeError = this.page.locator('[data-testid="error-time"]');
  readonly appointmentRows = this.page.locator('[data-testid="appointment-row"]');
  readonly appointmentTimes = this.page.locator('[data-testid="appt-time"]');
  readonly cancelButtons = this.page.locator('[data-testid="cancel-appointment"]');

  constructor(page: Page) { super(page); }

  async open(appointments: Appointment[] = []): Promise<void> {
    if (appointments.length > 0) await this.setLocalStorage(BookingPage.storageKey, appointments);
    await this.page.goto(pathToFileURL(this.appPath).href);
  }

  async fillForm(details: BookingDetails = {}): Promise<void> {
    await this.patientName.fill(details.name ?? 'Maria Müller');
    await this.dateOfBirth.fill(details.dob ?? '1980-01-01');
    await this.email.fill(details.email ?? 'maria@example.com');
    await this.doctor.selectOption(details.doctor ?? 'weber');
    await this.reason.selectOption(details.reason ?? 'Check-up');
    await this.date.fill(details.date ?? BookingPage.futureWeekday());
    await this.time.selectOption(details.time ?? '09:00');
  }

  async book(): Promise<void> { await this.bookButton.click(); }
  async cancelFirstAppointment(): Promise<void> { await this.cancelButtons.first().click(); }
  async expectNameError(text: string): Promise<void> { await expect(this.nameError).toHaveText(text); }
  async expectTimeError(text: string): Promise<void> { await expect(this.timeError).toContainText(text); }
  async expectRowCount(count: number): Promise<void> { await expect(this.appointmentRows).toHaveCount(count); }
  async expectRowsContain(text: string): Promise<void> { await expect(this.appointmentRows).toContainText(text); }
  async expectAppointmentTime(text: string): Promise<void> { await expect(this.appointmentTimes.first()).toHaveText(text); }

  private static futureWeekday(daysAhead = 1): string {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    while ([0, 6].includes(date.getDay())) date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }
}

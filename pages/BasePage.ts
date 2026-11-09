import { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected async setLocalStorage<T>(key: string, value: T): Promise<void> {
    await this.page.addInitScript(({ storageKey, storageValue }) => {
      localStorage.setItem(storageKey, JSON.stringify(storageValue));
    }, { storageKey: key, storageValue: value });
  }
}

import type { Page } from '@playwright/test';
import { BaseComponent } from '../core/BaseComponent';
import { waitForNetworkSettled } from '../helpers/wait.helper';

export class SearchComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('header, body').first());
  }

  get input() {
    return this.locators.headerSearchInput();
  }

  get submitButton() {
    return this.locators.headerSearchSubmit();
  }

  get filterDropdown() {
    return this.locators.searchFilterDropdown();
  }

  async typeQuery(query: string): Promise<void> {
    await this.input.click();
    await this.input.fill(query);
  }

  async search(query: string, options?: { useSubmit?: boolean }): Promise<void> {
    await this.typeQuery(query);
    if (options?.useSubmit !== false) {
      const submit = this.submitButton;
      if (await submit.isVisible().catch(() => false)) {
        await submit.click();
      } else {
        await this.input.press('Enter');
      }
    }
    await waitForNetworkSettled(this.page);
  }

  async searchWithEmptySubmit(): Promise<void> {
    await this.input.clear();
    const submit = this.submitButton;
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
    } else {
      await this.input.press('Enter');
    }
  }
}

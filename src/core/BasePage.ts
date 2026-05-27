import type { Page, Locator } from '@playwright/test';
import { LocatorStrategy } from '../locators/locator-strategy';
import { getEnvironmentConfig } from '../config/environment';

export abstract class BasePage {
  protected readonly locators: LocatorStrategy;
  protected readonly config = getEnvironmentConfig();

  constructor(protected readonly page: Page) {
    this.locators = new LocatorStrategy(page);
  }

  abstract readonly path: string;

  async open(path?: string): Promise<void> {
    await this.page.goto(path ?? this.path, { waitUntil: 'domcontentloaded' });
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {
      /* SPA / third-party analytics may prevent full idle; continue */
    });
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}

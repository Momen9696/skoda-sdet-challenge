import type { Locator, Page } from '@playwright/test';
import { LocatorStrategy } from '../locators/locator-strategy';

export abstract class BaseComponent {
  protected readonly locators: LocatorStrategy;

  constructor(
    protected readonly page: Page,
    protected readonly root: Locator,
  ) {
    this.locators = new LocatorStrategy(page);
  }

  protected child(selector: string): Locator {
    return this.root.locator(selector);
  }
}

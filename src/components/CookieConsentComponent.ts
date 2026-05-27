import type { Page } from '@playwright/test';
import { BaseComponent } from '../core/BaseComponent';
import { acceptCookiesIfPresent } from '../helpers/cookie.helper';

export class CookieConsentComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('#cookie-bar'));
  }

  async acceptIfVisible(): Promise<void> {
    await acceptCookiesIfPresent(this.page);
  }
}

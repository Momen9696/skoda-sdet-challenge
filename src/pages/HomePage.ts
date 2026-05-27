import { BasePage } from '../core/BasePage';
import { CookieConsentComponent } from '../components/CookieConsentComponent';
import { SearchComponent } from '../components/SearchComponent';

export class HomePage extends BasePage {
  readonly path = '/';

  readonly cookieConsent = new CookieConsentComponent(this.page);
  readonly search = new SearchComponent(this.page);

  async navigate(): Promise<void> {
    await this.open();
    await this.cookieConsent.acceptIfVisible();
    await this.waitForReady();
  }
}

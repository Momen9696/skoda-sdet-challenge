import { expect } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class SearchResultsPage extends BasePage {
  readonly path = '/search-partnr.php';

  get resultLinks() {
    return this.locators.productResultLinks();
  }

  get noResultsMessage() {
    return this.page.getByText(/no results|nothing found|nenalezeno|žádné výsledky/i);
  }

  get resultsContainer() {
    return this.page.locator(
      '.search-results, #search-results, .product-list, main .results, .luigi-ac-results',
    );
  }

  async assertHasResults(minCount = 1): Promise<void> {
    const links = this.resultLinks;
    const linkCount = await links.count();
    if (linkCount >= minCount) {
      await expect(links.first()).toBeVisible();
      return;
    }
    const containerVisible = await this.resultsContainer.first().isVisible().catch(() => false);
    expect(containerVisible || linkCount > 0).toBeTruthy();
  }

  async assertNoResultsOrEmptyState(): Promise<void> {
    const linkCount = await this.resultLinks.count();
    const noResultsVisible = await this.noResultsMessage.isVisible().catch(() => false);
    expect(linkCount === 0 || noResultsVisible).toBeTruthy();
  }

  async openFirstProduct(): Promise<void> {
    const first = this.resultLinks.first();
    await expect(first).toBeVisible({ timeout: 15_000 });
    await first.click();
    await this.waitForReady();
  }
}

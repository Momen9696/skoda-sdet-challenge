import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { normalizeForComparison } from '../utils/czech-text';

/**
 * Page Object for validating both:
 * - Results page for valid search
 * - "No results" state for invalid/empty search
 */
export class ResultsPage {
  // Phase 3 Results page locators (exact selectors from the requirements).
  private readonly title: Locator;
  private readonly productsContainer: Locator;
  private readonly resultItems: Locator;
  private readonly firstResultName: Locator;
  private readonly firstResultLink: Locator;

  // Phase 4 No results locators (exact selectors from the requirements).
  private readonly noResultsMessageContainer: Locator;
  private readonly noResultsMessageTitle: Locator;

  constructor(private readonly page: Page) {
    this.title = this.page.locator('div#main > h1 > span.title');
    this.productsContainer = this.page.locator('#products');
    this.resultItems = this.page.locator('li[data-lb-id]');
    this.firstResultName = this.page.locator('li[data-lb-id]:first-of-type h3 a strong');
    this.firstResultLink = this.page.locator('li[data-lb-id]:first-of-type h3 a');

    this.noResultsMessageContainer = this.page.locator('div.LBMessage');
    this.noResultsMessageTitle = this.page.locator('div.LBMessage > h1');
  }

  /**
   * Waits for results title to be visible.
   */
  async waitForResultsLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
  }

  /**
   * Returns the visible results title text.
   */
  async getResultsTitleText(): Promise<string> {
    return this.title.innerText();
  }

  /**
   * Returns the first result name (<strong>) text.
   */
  async getFirstResultNameText(): Promise<string> {
    return this.firstResultName.innerText();
  }

  /**
   * Returns the `href` attribute for the first result link.
   * Handy for deeper validations without parsing UI text.
   */
  async getFirstResultLinkHref(): Promise<string | null> {
    return this.firstResultLink.getAttribute('href');
  }

  /**
   * Asserts that the results title contains the provided search term.
   * Comparison is normalized for Czech diacritics and case.
   */
  async assertResultsTitleContainsTerm(term: string): Promise<void> {
    const actual = await this.getResultsTitleText();
    expect(normalizeForComparison(actual)).toContain(normalizeForComparison(term));
  }

  /**
   * Asserts that the first result name contains the provided search term.
   * Comparison is normalized for Czech diacritics and case.
   */
  async assertFirstResultNameContainsTerm(term: string): Promise<void> {
    const actual = await this.getFirstResultNameText();
    expect(normalizeForComparison(actual)).toContain(normalizeForComparison(term));
  }

  /**
   * Returns the number of result items currently present.
   * If `#products` is missing, the count will be 0.
   */
  async getResultItemsCount(): Promise<number> {
    return this.resultItems.count();
  }

  /**
   * Returns whether the results container is attached in the DOM.
   */
  async isProductsContainerAttached(): Promise<boolean> {
    return (await this.productsContainer.count()) > 0;
  }

  /**
   * Waits for the "no results" message title to be visible.
   */
  async waitForNoResultsMessage(): Promise<void> {
    await expect(this.noResultsMessageTitle).toBeVisible();
  }

  /**
   * Returns the no-results title text.
   */
  async getNoResultsTitleText(): Promise<string> {
    return this.noResultsMessageTitle.innerText();
  }

  /**
   * Returns the full no-results message body text (including title).
   */
  async getNoResultsMessageBodyText(): Promise<string> {
    return this.noResultsMessageContainer.innerText();
  }

  /**
   * Asserts the exact no-results title and message body according to requirements.
   * Title check is normalized for diacritics and case; body check uses normalized contains.
   */
  async assertNoResultsMessage(expectedTitle: string, expectedBody: string): Promise<void> {
    const actualTitle = await this.getNoResultsTitleText();
    expect(normalizeForComparison(actualTitle)).toBe(normalizeForComparison(expectedTitle));

    const actualBody = await this.getNoResultsMessageBodyText();
    expect(normalizeForComparison(actualBody)).toContain(normalizeForComparison(expectedBody));
  }

  /**
   * Returns true if results title is visible.
   */
  async isResultsTitleVisible(): Promise<boolean> {
    return this.title.isVisible().catch(() => false);
  }

  /**
   * Returns true if no-results message title is visible.
   */
  async isNoResultsTitleVisible(): Promise<boolean> {
    return this.noResultsMessageTitle.isVisible().catch(() => false);
  }
}


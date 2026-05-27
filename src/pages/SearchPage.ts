import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { dismissOverlays } from '../helpers/navigation.helper';
import { normalizeForComparison } from '../utils/czech-text';

/**
 * Page Object for the skoda-dily.cz search widget:
 * model dropdown + autocomplete input + suggestion list + submit action.
 */
export class SearchPage {
  private readonly modelDropdown: Locator;
  private readonly searchInput: Locator;
  private readonly submitButton: Locator;

  private readonly suggestionsContainer: Locator;
  private readonly suggestionsHeader: Locator;
  private readonly suggestionItems: Locator;
  private readonly firstSuggestionByDataResultId1: Locator;
  private readonly showAllButton: Locator;

  constructor(private readonly page: Page) {
    // Phase 1 locators (exact selectors from the requirements).
    this.modelDropdown = this.page.locator('#top-select-model'); // CSS
    this.searchInput = this.page.locator('#LBautocomplete'); // CSS
    // Submit button is not unique globally on the page (newsletter/login/etc.),
    // so we scope it to the same form as the autocomplete input.
    this.submitButton = this.searchInput.locator(
      "xpath=ancestor::form//button[@type='submit' and contains(@class,'button')]",
    );

    // Phase 2 locators (exact selectors from the requirements).
    this.suggestionsContainer = this.page.locator(
      'div.luigi-ac-products.luigi-ac-main', // CSS
    );
    this.suggestionsHeader = this.page.locator(
      'div.luigi-ac-products.luigi-ac-main > div.luigi-ac-header', // CSS
    );
    this.suggestionItems = this.page.locator(
      'a.luigi-ac-item.luigi-ac-product', // CSS
    );
    this.firstSuggestionByDataResultId1 = this.page.locator('a[data-result-id="1"]'); // CSS
    this.showAllButton = this.page.locator('div.luigi-ac-button-block[role="button"]'); // CSS
  }

  /**
   * Navigates to the website home page and dismisses non-blocking overlays.
   * Uses the Playwright `baseURL` from configuration.
   */
  async open(): Promise<void> {
    await this.page.goto('/');
    await dismissOverlays(this.page);
  }

  /**
   * Selects a model in the model dropdown by visible option text.
   * @param modelText Visible text of the model option.
   * @returns Selected option value attribute.
   */
  async selectModel(modelText: string): Promise<string> {
    const options = this.modelDropdown.locator('option');
    const matchedOptions = options.filter({ hasText: modelText });
    await expect(matchedOptions.first()).toBeAttached();

    const value = await matchedOptions.first().getAttribute('value');
    if (!value) throw new Error(`Model option "${modelText}" has no value attribute.`);

    await this.modelDropdown.selectOption(value);
    return value;
  }

  /**
   * Gets the currently selected value from the model dropdown.
   */
  async getSelectedModelValue(): Promise<string> {
    return this.modelDropdown.inputValue();
  }

  /**
   * Types a search term in the autocomplete input.
   * Note: suggestions appear asynchronously; use `waitForSuggestions()` before interacting with them.
   * @param term Search term to type.
   */
  async typeSearchTerm(term: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(term);
  }

  /**
   * Submits the search using the submit button (bypasses autocomplete click).
   */
  async submitSearch(): Promise<void> {
    await this.submitButton.first().click();
  }

  /**
   * Waits for autocomplete suggestions to appear by ensuring suggestion items are attached.
   * This is stronger than only waiting for the container to be visible.
   */
  async waitForSuggestions(): Promise<void> {
    await expect(this.suggestionsContainer).toBeVisible();
    await expect(this.suggestionItems.first()).toBeAttached();
    await expect(this.suggestionItems.first()).toBeVisible();
  }

  /**
   * Returns visible suggestions dropdown header text.
   * Useful for debugging and additional UX validation.
   */
  async getSuggestionsHeaderText(): Promise<string> {
    return this.suggestionsHeader.innerText();
  }

  /**
   * Returns the count of currently visible suggestion items.
   */
  async getVisibleSuggestionsCount(): Promise<number> {
    return this.suggestionItems.count();
  }

  /**
   * Clicks the first suggestion using the `data-result-id="1"` locator.
   * Prefer this for stability when ordering changes.
   */
  async selectFirstSuggestion(): Promise<void> {
    await expect(this.firstSuggestionByDataResultId1).toBeVisible();
    await this.firstSuggestionByDataResultId1.click();
  }

  /**
   * Clicks a suggestion by matching the `data-autocomplete-value` attribute.
   * @param autocompleteValue Exact `data-autocomplete-value` value.
   */
  async selectSuggestionByAutocompleteValue(autocompleteValue: string): Promise<void> {
    // Phase 2 XPath locator (exact structure from requirements).
    const xpath = `//a[contains(@class,'luigi-ac-item') and @data-autocomplete-value="${autocompleteValue}"]`;
    const locator = this.page.locator(`xpath=${xpath}`);
    await expect(locator.first()).toBeVisible();
    await locator.first().click();
  }

  /**
   * Clicks the "Show all" button in the autocomplete suggestions dropdown (if present).
   * Note: not required for the TC scenarios, but useful for debugging.
   */
  async clickShowAll(): Promise<void> {
    if (await this.showAllButton.isVisible().catch(() => false)) {
      await this.showAllButton.click();
    }
  }

  /**
   * Gets `data-autocomplete-value` attribute values for all currently visible suggestions.
   */
  async getVisibleSuggestionAutocompleteValues(): Promise<string[]> {
    const values = await this.suggestionItems.evaluateAll((elements) => {
      return elements
        .map((el) => el.getAttribute('data-autocomplete-value'))
        .filter((v) => typeof v === 'string' && v.length > 0) as string[];
    });
    return values;
  }

  /**
   * Utility for test validation: checks whether every visible suggestion's
   * `data-autocomplete-value` contains the typed substring (normalized).
   */
  async assertEverySuggestionContainsTypedSubstring(typedSubstring: string): Promise<void> {
    const typedNormalized = normalizeForComparison(typedSubstring);
    const suggestionValues = await this.getVisibleSuggestionAutocompleteValues();

    expect(suggestionValues.length).toBeGreaterThan(0);
    for (const value of suggestionValues) {
      const normalized = normalizeForComparison(value);
      expect(normalized).toContain(typedNormalized);
    }
  }
}


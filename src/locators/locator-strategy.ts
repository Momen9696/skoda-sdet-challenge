import type { Locator, Page } from '@playwright/test';

/**
 * Resilient locator composition: prefer role/label, fall back to stable CSS.
 * Reduces brittleness when minor DOM refactors occur.
 */
export class LocatorStrategy {
  constructor(protected readonly page: Page) {}

  /** First visible match among candidates (OR chain). */
  or(...candidates: Locator[]): Locator {
    if (candidates.length === 0) {
      throw new Error('LocatorStrategy.or requires at least one candidate');
    }
    return candidates.slice(1).reduce((acc, loc) => acc.or(loc), candidates[0]);
  }

  headerSearchInput(): Locator {
    return this.or(
      this.page.getByRole('searchbox'),
      this.page.locator('#partnr, input[name="partnr"], input[name="q"]'),
      this.page.locator('.luigi-ac input, .luigisbox input, [class*="luigi"] input').first(),
      this.page.locator('header input[type="text"], header input[type="search"]').first(),
    );
  }

  headerSearchSubmit(): Locator {
    return this.or(
      this.page.getByRole('button', { name: /search|hledat|vyhledat/i }),
      this.page.locator('form[action*="search"] button[type="submit"], .search-submit, #search-btn'),
      this.page.locator('header button[type="submit"]').first(),
    );
  }

  searchFilterDropdown(): Locator {
    return this.or(
      this.page.locator('select[name*="filter"], select.search-filter, #search-filter'),
      this.page.locator('header select').first(),
    );
  }

  productResultLinks(): Locator {
    return this.or(
      this.page.locator('.product-list a[href*="product"], .search-results a[href]'),
      this.page.locator('main a[href*=".html"], .results a[href]'),
      this.page.getByRole('link', { name: /detail|product|zobrazit/i }),
    );
  }
}
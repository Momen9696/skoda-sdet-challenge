import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ApiClient } from '../api/ApiClient';
import { dismissOverlays } from '../helpers/navigation.helper';

type PageFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  apiClient: ApiClient;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  page: async ({ page }, use) => {
    await use(page);
  },
});

export const authenticatedTest = test.extend({
  page: async ({ page }, use) => {
    await page.goto('/');
    await dismissOverlays(page);
    await use(page);
  },
});

test.beforeEach(async ({ page }) => {
  await dismissOverlays(page);
});

export { expect } from '@playwright/test';
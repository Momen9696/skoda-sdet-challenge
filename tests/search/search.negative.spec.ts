import { test, expect } from '../../src/fixtures/test-fixtures';
import { Tags } from '../../src/config/test-tags';
import { SearchQueries } from '../../src/data/search-data';
import { attachTestMetadata } from '../../src/reporting/allure.helper';
import { softAssertAll } from '../../src/assertions/custom.assertions';

test.describe('Search — negative & edge cases', { tag: [Tags.SEARCH, Tags.NEGATIVE, Tags.REGRESSION] }, () => {
  test.beforeEach(async ({ homePage }) => {
    attachTestMetadata('Search', 'Invalid and empty input handling', 'normal');
    await homePage.navigate();
  });

  test('nonsense query does not show misleading product grid @negative', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search.search(SearchQueries.nonsense);
    await searchResultsPage.assertNoResultsOrEmptyState();
  });

  test('empty search submit — soft checks for validation or empty state @negative', async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    await homePage.search.searchWithEmptySubmit();

    await softAssertAll([
      async () => {
        const url = page.url();
        expect(url.length).toBeGreaterThan(0);
      },
      async () => {
        const resultCount = await searchResultsPage.resultLinks.count();
        const noResults = await searchResultsPage.noResultsMessage.isVisible().catch(() => false);
        expect(resultCount === 0 || noResults).toBeTruthy();
      },
    ]);
  });
});

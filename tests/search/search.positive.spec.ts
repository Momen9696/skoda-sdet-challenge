import { test, expect } from '../../src/fixtures/test-fixtures';
import { Tags } from '../../src/config/test-tags';
import { SearchQueries } from '../../src/data/search-data';
import { attachTestMetadata } from '../../src/reporting/allure.helper';

test.describe('Search — positive flows', { tag: [Tags.SMOKE, Tags.SEARCH, Tags.REGRESSION] }, () => {
  test.beforeEach(async ({ homePage }) => {
    attachTestMetadata('Search', 'Valid query returns catalog results', 'critical');
    await homePage.navigate();
  });

  test('valid part number search returns product results @smoke', async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    await homePage.search.search(SearchQueries.validPartNumber);
    await expect(page).toHaveURL(/nahradni-dil(y)?\/|search|partnr|results|q=/i);
    await expect(page.locator('body')).toContainText(SearchQueries.validPartNumber);
  });

  test('generic search term surfaces multiple result links', async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search.search(SearchQueries.validGeneric);
    await searchResultsPage.assertHasResults(1);
    const count = await searchResultsPage.resultLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

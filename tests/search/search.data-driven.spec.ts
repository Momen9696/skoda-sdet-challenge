import { test } from '../src/fixtures/test-fixtures';
import { Tags } from '../src/config/test-tags';
import { loadJsonData } from '../src/data/test-data-loader';
import type { SearchQueryCase } from '../src/data/search-data';
import { attachTestMetadata } from '../src/reporting/allure.helper';
const dataDrivenCases = loadJsonData<SearchQueryCase[]>('test-data/search-queries.json');
test.describe('Search — data-driven', { tag: [Tags.SEARCH, Tags.DATA_DRIVEN, Tags.REGRESSION] }, () => {
  for (const searchCase of dataDrivenCases) {
    test(`[${searchCase.id}] ${searchCase.description}`, async ({ homePage, searchResultsPage }) => {
      attachTestMetadata('Search', searchCase.description, 'normal');
      await homePage.navigate();
      await homePage.search.search(searchCase.query);

      if (searchCase.expectResults) {
        await searchResultsPage.assertHasResults(searchCase.minResultCount ?? 1);
      } else {
        await searchResultsPage.assertNoResultsOrEmptyState();
      }
    });
  }
});

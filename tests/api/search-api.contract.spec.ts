import { test, expect } from '../../src/fixtures/test-fixtures';
import { Tags } from '../../src/config/test-tags';
import { SearchQueries } from '../../src/data/search-data';
import { attachTestMetadata } from '../../src/reporting/allure.helper';

/**
 * Contract-style smoke for API extensibility — documents search-partnr.php behavior (CH-01.02).
 * Full schema validation can be added when JSON contract is available.
 */
test.describe('API readiness — search contract', { tag: [Tags.API_READY, Tags.SEARCH] }, () => {
  test('search-partnr endpoint responds for valid query @api-ready', async ({ apiClient }) => {
    attachTestMetadata('API', 'search-partnr.php availability', 'normal');

    const response = await apiClient.get('searchPartNumber', {
      params: { partnr: SearchQueries.validPartNumber },
    });

    expect(response.status()).toBeLessThan(500);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/html|json/i);
  });
});

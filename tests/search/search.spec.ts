import { test, expect } from '../../src/fixtures/test-fixtures';
import { Tags } from '../../src/config/test-tags';
import { SearchPage } from '../../src/pages/SearchPage';
import { ResultsPage } from '../../src/pages/ResultsPage';
import { normalizeForComparison } from '../../src/utils/czech-text';

const expectedNoResultsTitle = 'žádné výsledky';
const expectedNoResultsBody =
  'Bohužel jsme nenalezli žádný díl, který by odpovídal Vašemu vyhledávání. Zkuste, prosím, zjednodušit vyhledávací dotaz nebo nás kontaktujte, rádi pro Vás najdeme požadovaný díl.';

test.describe('Search Feature - Valid', { tag: [Tags.SEARCH, Tags.REGRESSION] }, () => {
  test('TC1 — Valid search with model + term (autocomplete suggest item click)', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);
    await searchPage.open();
    await searchPage.selectModel('Citigo');
    const term = 'Těsnící kroužek';
    await searchPage.typeSearchTerm(term);
    await searchPage.waitForSuggestions();
    const suggestionsCount = await searchPage.getVisibleSuggestionsCount();
    expect(suggestionsCount).toBeGreaterThan(0);
    await searchPage.selectFirstSuggestion();
    await resultsPage.waitForResultsLoaded();
    await resultsPage.assertResultsTitleContainsTerm(term);
  });

  test('TC2 — Valid search via submit button (no suggestion click)', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);
    await searchPage.open();
    const term = 'Těsnící kroužek';
    await searchPage.typeSearchTerm(term);
    await searchPage.submitSearch();
    await resultsPage.waitForResultsLoaded();
    await resultsPage.assertResultsTitleContainsTerm(term);
    await resultsPage.assertFirstResultNameContainsTerm(term);
  });

  test.describe('Search Feature - Autocomplete', { tag: [Tags.SEARCH, Tags.DATA_DRIVEN] }, () => {
    test('TC3 — Autocomplete suggestions appear and are correct', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.open();
  
      const partialTerm = 'Těs';
      await searchPage.typeSearchTerm(partialTerm);
      await searchPage.waitForSuggestions();
  
      await searchPage.assertEverySuggestionContainsTypedSubstring(partialTerm);
    });
  });

  test('TC4 — Model dropdown selection persists in search', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);
    await searchPage.open();
    const modelLabel = 'Citigo';
    const selectedModelValue = await searchPage.selectModel(modelLabel);
    const actualSelectedValue = await searchPage.getSelectedModelValue();
    expect(actualSelectedValue).toBe(selectedModelValue);
    const term = 'Těsnící kroužek';
    await searchPage.typeSearchTerm(term);
    await searchPage.submitSearch();
    await resultsPage.waitForResultsLoaded();
    const url = page.url();
    const urlObj = new URL(url);
    const setModelParam = urlObj.searchParams.get('setmodel') ?? urlObj.searchParams.get('set_model');
    if (setModelParam) {
      expect(normalizeForComparison(setModelParam)).toBe(normalizeForComparison(selectedModelValue));
    }
  });
});

test.describe('Search Feature - Invalid', { tag: [Tags.SEARCH, Tags.NEGATIVE, Tags.REGRESSION] }, () => {
  test('TC5 — Invalid search shows "no results" message', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);
    await searchPage.open();
    await searchPage.typeSearchTerm('zzzqqqxxx123');
    await resultsPage.waitForNoResultsMessage();
    await resultsPage.assertNoResultsMessage(expectedNoResultsTitle, expectedNoResultsBody);
    const itemsCount = await resultsPage.getResultItemsCount();
    const productsAttached = await resultsPage.isProductsContainerAttached();
    if (productsAttached) {
      expect(itemsCount).toBe(0);
    } else {
      expect(itemsCount).toBe(0);
    }
  });
});
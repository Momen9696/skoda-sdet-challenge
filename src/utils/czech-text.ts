/**
 * Czech/diacritic-safe string normalization utilities for assertions.
 */
export function normalizeForComparison(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // Decompose diacritics (NFD) and remove combining marks.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Collapse whitespace to make assertions resilient to markup differences.
    .replace(/\s+/g, ' ');
}

/**
 * Case/diacritic-safe substring check.
 */
export function containsNormalized(haystack: string, needle: string): boolean {
  const h = normalizeForComparison(haystack);
  const n = normalizeForComparison(needle);
  return h.includes(n);
}


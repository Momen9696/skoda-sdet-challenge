/**
 * Central registry for Playwright grep-based test tagging.
 * Usage: test.describe('...', { tag: [Tags.SMOKE, Tags.SEARCH] }, () => { ... })
 */
export const Tags = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SEARCH: '@search',
  CHECKOUT: '@checkout',
  CART: '@cart',
  NEGATIVE: '@negative',
  DATA_DRIVEN: '@data-driven',
  API_READY: '@api-ready',
} as const;

export type TestTag = (typeof Tags)[keyof typeof Tags];
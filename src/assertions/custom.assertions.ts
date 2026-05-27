import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export async function assertUrlContains(page: Page, pattern: RegExp | string): Promise<void> {
  await expect(page).toHaveURL(typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern);
}

export async function assertMinimumVisibleCount(
  locator: ReturnType<Page['locator']>,
  min: number,
  message?: string,
): Promise<void> {
  const count = await locator.count();
  expect(count, message ?? `Expected at least ${min} visible elements`).toBeGreaterThanOrEqual(min);
}

export async function softAssertAll(
  checks: Array<() => Promise<void>>,
): Promise<void> {
  const errors: Error[] = [];
  for (const check of checks) {
    try {
      await check();
    } catch (e) {
      errors.push(e instanceof Error ? e : new Error(String(e)));
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, `${errors.length} soft assertion(s) failed`);
  }
}

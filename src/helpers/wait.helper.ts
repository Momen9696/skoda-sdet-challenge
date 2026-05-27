import type { Page, Locator } from '@playwright/test';

export async function waitForAnyVisible(
  locators: Locator[],
  timeout = 10_000,
): Promise<Locator | null> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const locator of locators) {
      if (await locator.first().isVisible().catch(() => false)) {
        return locator.first();
      }
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

export async function waitForNetworkSettled(page: Page, timeout = 8_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => undefined);
}

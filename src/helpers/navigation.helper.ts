import type { Page } from '@playwright/test';
import { acceptCookiesIfPresent } from './cookie.helper';

export async function navigateWithConsent(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await acceptCookiesIfPresent(page);
}

export async function dismissOverlays(page: Page): Promise<void> {
  await acceptCookiesIfPresent(page);
  const holidayBanner = page.locator('#staticmsgatt');
  if (await holidayBanner.isVisible({ timeout: 1_000 }).catch(() => false)) {
    /* informational only — no action required */
  }
}

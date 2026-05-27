import type { Page } from '@playwright/test';

export async function acceptCookiesIfPresent(page: Page): Promise<void> {
  const cookieBar = page.locator('#cookie-bar');
  const acceptButton = page.locator('#cb-yes');

  if (await cookieBar.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await acceptButton.click();
    await cookieBar.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

import { test } from '@playwright/test';

export function attachTestMetadata(feature: string, story: string, severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial' = 'normal'): void {
  test.info().annotations.push(
    { type: 'feature', description: feature },
    { type: 'story', description: story },
    { type: 'severity', description: severity },
  );
}

export async function attachScreenshotOnFailure(page: import('@playwright/test').Page): Promise<void> {
  if (test.info().status !== test.info().expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
  }
}

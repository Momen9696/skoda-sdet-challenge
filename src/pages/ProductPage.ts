import { expect } from '@playwright/test';
import { BasePage } from '../core/BasePage';

export class ProductPage extends BasePage {
  readonly path = '';


  get productTitle() {
    return this.page.locator('h1, .product-title, #product-name').first();
  }

  get quantityInput() {
    return this.page.locator('input[name*="qty"], input[name*="quantity"], #quantity').first();
  }

  async addToCart(quantity = 1): Promise<void> {
    if (quantity > 1 && (await this.quantityInput.isVisible().catch(() => false))) {
      await this.quantityInput.fill(String(quantity));
    }
    await expect(this.addToCartButton).toBeVisible({ timeout: 15_000 });
    await this.addToCartButton.click();
    await this.waitForReady();
  }
}

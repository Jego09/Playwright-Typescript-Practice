import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  private page: Page;
  private SUBSCRIPTION_TEXT: string;
  private EMAIL_FIELD: string;
  private BUTTON: string;
  private SUCCESS_MESSAGE: string;
  private PRODUCT: (items: string) => Locator;
  private CART_QUANTITY: string;
  private CHECKOUT_BUTTON: string;
  private modalContent: Locator;
  private REGISTER_LOGIN_BUTTON: string;


  constructor(page: Page) {
    this.page = page;
    this.SUBSCRIPTION_TEXT = 'Subscription';
    this.EMAIL_FIELD = '#susbscribe_email'
    this.SUCCESS_MESSAGE = 'You have been successfully subscribed!';
    this.BUTTON = 'button#subscribe';
    this.PRODUCT = (items: string) => page.locator(`//a[contains(text(), '${items}')]`);
    this.CART_QUANTITY = '//td[@class="cart_quantity"]//button[@class="disabled"]';
    this.CHECKOUT_BUTTON = 'Proceed To Checkout';
    this.modalContent = page.locator('.modal-content');
    this.REGISTER_LOGIN_BUTTON = '//a[@href="/login"]';
  }
    get subscriptionText(): Locator {
        return this.page.locator(`//h2[contains(text(), "${this.SUBSCRIPTION_TEXT}")]`);
    }
    async FillEmailField(email: string): Promise<void> {
        await this.page.locator(this.EMAIL_FIELD).fill(email);
        console.log(email);
        await this.page.locator(this.BUTTON).click();
        console.log('Clicked on Subscribe button');
        await expect(this.page.getByText(this.SUCCESS_MESSAGE)).toBeVisible();
        console.log('Subscription success message is visible');
    }

    async validateCartItems(items: string): Promise<void> {
        await expect(this.PRODUCT(items)).toBeVisible();
    }
    async validateCartQuantity(index: number, expectedQuantity: number): Promise<void> {
      // Use nth(index) if there are multiple products in cart
      const cartItem = this.page.locator(this.CART_QUANTITY).nth(index);

      // Use textContent() for <button>
      const value = await cartItem.textContent();
      const actualQuantity = parseInt(value || "0", 10);

      console.log(`Cart quantity found: ${actualQuantity}`);
      expect(actualQuantity).toBe(expectedQuantity);

      console.log(`✅ Validated that the cart quantity is: ${expectedQuantity}`);
  }
  async clickCheckoutButton(): Promise<void> {
    await this.page.getByText(this.CHECKOUT_BUTTON).click();
    console.log('Clicked on Checkout button');
  }
  async clickRegisterLoginButton(): Promise<void> {
    await this.page.getByRole('link', { name: 'Register / Login' }).click();
    console.log('Clicked on Register/Login button');
  }
}
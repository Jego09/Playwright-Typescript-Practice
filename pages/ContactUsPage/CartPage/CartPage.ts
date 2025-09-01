import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  private page: Page;
  private SUBSCRIPTION_TEXT: string;
  private EMAIL_FIELD: string;
  private BUTTON: string;
  private SUCCESS_MESSAGE: string;
  private PRODUCT: (items: string) => Locator;


  constructor(page: Page) {
    this.page = page;
    this.SUBSCRIPTION_TEXT = 'Subscription';
    this.EMAIL_FIELD = '#susbscribe_email'
    this.SUCCESS_MESSAGE = 'You have been successfully subscribed!';
    this.BUTTON = 'button#subscribe';
    this.PRODUCT = (items: string) => page.locator(`//a[contains(text(), '${items}')]`);
  }
    get subscriptionText(): Locator {
        return this.page.locator(`//h2[contains(text(), "${this.SUBSCRIPTION_TEXT}")]`);
    }
    async FillEmailField(): Promise<void> {
        await this.page.locator(this.EMAIL_FIELD).fill('testemail@email.com');
        console.log('Filling email field with testemail@email.com');
        await this.page.locator(this.BUTTON).click();
        console.log('Clicked on Subscribe button');
        await expect(this.page.getByText(this.SUCCESS_MESSAGE)).toBeVisible();
        console.log('Subscription success message is visible');
    }

    async validateCartItems(items: string): Promise<void> {
        await expect(this.PRODUCT(items)).toBeVisible();

    }
}
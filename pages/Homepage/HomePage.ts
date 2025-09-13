import { Page, Locator, expect } from '@playwright/test';
import { baseValue, HomePageLocators } from './Homepage-Locators';
import dotenv from 'dotenv';
dotenv.config();

export class HomePage {

  private page: Page;
  private readonly H = HomePageLocators;
  private NAVBAR: string;
  private HOMEPAGE: string;

  constructor(page: Page) {
    this.page = page;
    this.NAVBAR = 'nav navbar-nav';
    this.HOMEPAGE = 'https://automationexercise.com/';
  }

  get loginButton(): Locator {
    return this.page.locator(this.H.LoginButton);
  }

  get deleteAccountButton(): Locator {
    return this.page.locator(this.H.DeleteAccountButton);
  }
  get featuredProducts(): Locator {
    return this.page.locator(this.H.featuredProducts);
  }
  get navBar(): Locator {
    return this.page.locator(`//div[@class="shop-menu pull-right"]//ul[@class="${this.NAVBAR}"]`);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.HOMEPAGE!, { 
      waitUntil: 'domcontentloaded' }); 
      await this.expectPageToBeVisible();
}

  async expectPageToBeVisible(): Promise<void> {
    await expect(this.page).toHaveURL(this.HOMEPAGE);
      await expect(this.page).toHaveTitle(/Automation Exercise/);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async hoverOverLoginButton(): Promise<void> {
    await this.loginButton.hover();
  }

  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountButton.click();
  }

  async accountDeletedValidation(): Promise<void> {
    await expect(this.page.getByText(baseValue.AccountDeletedMessage)).toBeVisible();
  }

  async deleteAccountAndValidate(): Promise<void> {
    await this.clickDeleteAccount();
    await this.accountDeletedValidation();
    console.log('Account Deleted Successfully');
  }
  async getLoggedInName(): Promise<string | null> {
    const loggedInName = await this.page.locator('text=Logged in as').locator('b').textContent();
    return loggedInName;
  }
  async expectLoggedInName(expectedName: string): Promise<void> {
    const loggedInName = await this.getLoggedInName();
    expect(loggedInName).toBe(expectedName);
  }

  async clickLogoutButton(): Promise<void> {
    await this.page.locator(this.H.Logout).click();
  }

  async clickContactUsButton(): Promise<void> {
    await this.page.locator(this.H.ContactUsButton).click();
  }
  async clickHomeButton(): Promise<void> {
    await this.page.locator(this.H.HomeButton).click();
  }
  async clickTestCaseButton(): Promise<void> {
    await this.page.locator(this.H.TestCaseButton).click();
      await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  }
  async clickProductsButton(): Promise<void> {
    await this.page.locator(this.H.ProductsButton).click();
      await expect(this.page.locator(this.H.featuredProducts)).toBeVisible();
  }
  async validateSubscriptionText(): Promise<void> {
    await expect(this.page.locator(this.H.SubscriptionText)).toBeVisible();
  }
  async fillSubscriptionField(field: string): Promise<void> {

    const subscriptionField = this.page.locator(this.H.SubscriptionField);
    await subscriptionField.scrollIntoViewIfNeeded();
    await subscriptionField.click();
    await subscriptionField.fill(field);
    await this.page.locator(this.H.SubscriptionButton).click();
    await expect(this.page.getByText(this.H.SubscriptionNotification)).toBeVisible();
  }
  async clickCartButton(): Promise<void> {
    await this.navBar.locator(this.H.CartButton).click();
  }
}
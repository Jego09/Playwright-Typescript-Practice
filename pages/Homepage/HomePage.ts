import { Page, Locator, expect } from '@playwright/test';
import { baseValue, HomePageLocators } from './Homepage-Locators';
import dotenv from 'dotenv';
dotenv.config();

export class HomePage {

  private page: Page;
  private readonly homePageLocators = HomePageLocators;

  constructor(page: Page) {
    this.page = page;
  }

  get loginButton(): Locator {
    return this.page.locator(this.homePageLocators.LoginButton);
  }

  get deleteAccountButton(): Locator {
    return this.page.locator(this.homePageLocators.DeleteAccountButton);
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.BASE_URL!);
      await this.expectPageToBeVisible();
}

  async expectPageToBeVisible(): Promise<void> {
    await expect(this.page).toHaveURL(process.env.BASE_URL!);
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
    await this.page.locator(this.homePageLocators.Logout).click();
  }

  async clickContactUsButton(): Promise<void> {
    await this.page.locator(this.homePageLocators.ContactUsButton).click();
  }
  async clickHomeButton(): Promise<void> {
    await this.page.locator(this.homePageLocators.HomeButton).click();
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { baseValue, HomePageLocators } from './Homepage-Locators';
import dotenv from 'dotenv';
dotenv.config();

// export class HomePage {
  // private page: Page;
  // private readonly homePageLocators = HomePageLocators;

  // constructor(page: Page) {
  //   this.page = page;
  // }

  // get loginButton(): Locator {
  //   return this.page.locator(HomePageLocators.LoginButton);
  // }

  // async goto(): Promise<void> {
  //   await this.page.goto(process.env.BASE_URL!);
  // }
  // async expectPageToBeVisible(): Promise<void> {
  //   await expect(this.page.locator(this.homePageLocators.LoginButton)).toBeVisible();
  // }
  // async clickLoginButton(): Promise<void> {
  //   await this.loginButton.click();
  // }
  // async clickDeleteAccount(): Promise<void> {
  //   await this.page.locator(HomePageLocators.DeleteAccountButton).click();
  // }

  // async accountDeletedValidation(): Promise<void> {
  //   await expect(this.page.getByText('Account Deleted!')).toBeVisible();
  // }
// }

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
    await expect(this.loginButton).toBeVisible();
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
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
}

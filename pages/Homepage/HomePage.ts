import { Page, Locator, expect } from '@playwright/test';
import { HomePageLocators } from './Homepage-Locators';


export class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get loginButton(): Locator {
    return this.page.locator(HomePageLocators.LoginButton);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }
  async clickDeleteAccount(): Promise<void> {
    await this.page.locator(HomePageLocators.DeleteAccountButton).click();
  }

  async accountDeletedValidation(): Promise<void> {
    await expect(this.page.getByText('Account Deleted!')).toBeVisible();
  }
}


import { Page, Locator } from '@playwright/test';
import { HomePageLocators } from '../locators/Homepage-Locators';

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
}


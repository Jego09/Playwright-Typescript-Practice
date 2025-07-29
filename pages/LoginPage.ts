import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get newSignupButton(): Locator {
    return this.page.getByText('New User Signup!');
  }

  async clickNewSignupButton(): Promise<void> {
    await this.newSignupButton.click();
  }
}
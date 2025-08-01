import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginLocators } from './LoginLocators';
import { randomString } from '../../utils/data';

dotenv.config();

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  get newSignupButton(): Locator {
    return this.page.getByText('New User Signup!');
  }
  get LoginToYourAccount(): Locator {
    return this.page.getByText('Login to your account');
  }
  get errorMessage(): Locator {
    return this.page.getByText('Your email or password is incorrect!');
  }
  async clickNewSignupButton(): Promise<void> {
    await this.newSignupButton.click();
  }
  async expectToBeVisible(): Promise<void> {
    await expect(this.newSignupButton).toBeVisible();
  }
  async expectLoginToYourAccount(): Promise<void> {
    await expect(this.LoginToYourAccount).toBeVisible();
  }

  async enterCredentials(): Promise<void> {
    await this.page.locator(LoginLocators.EmailInput).fill(process.env.EMAIL!);
      await this.page.locator(LoginLocators.PasswordInput).fill(process.env.PASSWORD!);
  }
  async clickLoginButton(): Promise<void> {
    await this.page.locator(LoginLocators.LoginButton).click();
  }
  async enterIncorrectCredentials(): Promise<void> {
    await this.page.locator(LoginLocators.EmailInput).fill(randomString(8) + '@gmail.com');
      await this.page.locator(LoginLocators.PasswordInput).fill(randomString(8));
        await this.clickLoginButton();
          await expect(this.errorMessage).toBeVisible();
  }
}
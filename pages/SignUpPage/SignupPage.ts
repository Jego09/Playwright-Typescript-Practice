import { Page, Locator, expect } from '@playwright/test';

export default class SignupPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get form(): Locator {
    return this.page.locator('form[action="/signup"]');
  }

  async fillForm(fields: Record<string, string>): Promise<void> {
    for (const [name, value] of Object.entries(fields)) {
      await this.form.locator(`input[name="${name}"]`).fill(value);
    }
  }

  async submitForm(): Promise<void> {
    await this.form.locator('button[type="submit"]').click();
  }
  async emailDuplicateErrorMessage(): Promise<Locator> {
  const locator = this.page.getByText('Email Address already exist!');
  await locator.waitFor(); 
  return locator;
  } 
}
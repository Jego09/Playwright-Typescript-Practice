import { Page, Locator, expect } from '@playwright/test';

export class AccountInformationPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get form(): Locator {
    return this.page.locator('form[action="/signup"]');
  }

  async fillForm(fields: Record<string, string>): Promise<void> {

    for (const [name, value] of Object.entries(fields)) {

      if (name === 'ID') continue;

      if (name === 'title') {

        await this.form.locator(`input[type="radio"][name="${name}"][value="${value}"]`).check();
        continue;
      } 
      
      if (name === 'days' || name === 'months' || name === 'years' || name === 'country') {
        await this.form.locator(`select[name="${name}"]`).selectOption(value);
        continue;
      }
        await this.form.locator(`input[id="${name}"]`).fill(value);
      }
    }

  async submitForm(): Promise<void> {
    await this.form.getByText('Create Account').click();
  }

  async expectToBeVisible(): Promise<void> {
    await expect(this.form).toBeVisible();
  }
}
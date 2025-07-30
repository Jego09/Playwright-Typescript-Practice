import { Page, Locator, expect } from '@playwright/test';
import { baseValue } from '../../utils/common';

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

      if (name === baseValue.ID) continue;

      if (name === baseValue.title) {

        await this.form.locator(`input[type="radio"][name="${name}"][value="${value}"]`).check();
        continue;
      } 
      
      if (name === baseValue.days || name === baseValue.months || name === baseValue.years || name === baseValue.country) {
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
  async AccountCreatedValidation(): Promise<void> {
    await expect(this.page.getByText('Account Created!')).toBeVisible();
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
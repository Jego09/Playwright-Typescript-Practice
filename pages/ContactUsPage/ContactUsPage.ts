import { Page, expect, Locator } from '@playwright/test';
import { handlingAlertMessages } from '../../utils/data';
import { ContactLocators } from './Contact-Locators';


export class ContactUsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get contactUsForm(): Locator {
    return this.page.locator('form[action="/contact_us"]');
  }

  async formToBeVisible(): Promise<void> {
    await expect(this.contactUsForm).toBeVisible();
  }

  async fillContactForm(fields: Record<string, string>): Promise<void> {
    for (const [name, value] of Object.entries(fields)) {
      await this.page.locator(`[data-qa="${name}"]`).fill(value);
    }
  }

  async submitContactForm(): Promise<void> {
    handlingAlertMessages(this.page); 
        await this.page.locator(ContactLocators.SubmitButton).click();
}
  async expectSuccessMessage(): Promise<void> {
    await expect(this.page.locator(ContactLocators.SuccessMessage)).toBeVisible()
  }
}

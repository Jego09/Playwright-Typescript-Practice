import { Page, Locator, expect } from '@playwright/test';
import { baseValue } from '../../utils/common';

export default class SignupPage {
  private page: Page;
  private CONTINUE_BUTTON: string;
  private ENTER_ACCOUNT_INFORMATION: 'Enter Account Information';


  constructor(page: Page) {
    this.page = page;
    this.CONTINUE_BUTTON = '//*[@data-qa="continue-button"]';
    this.ENTER_ACCOUNT_INFORMATION = 'Enter Account Information';
  }

  get form(): Locator {
    return this.page.locator('form[action="/signup"]');
  }

  // async fillForm(fields: Record<string, string>): Promise<void> {
  //   for (const [name, value] of Object.entries(fields)) {
  //     await this.form.locator(`input[name="${name}"]`).fill(value); 
  //   }
  // }
async fillForm(fields: Record<string, unknown>): Promise<void> {
  for (const [name, rawValue] of Object.entries(fields)) {
    if (name === baseValue.ID) continue;
    if (rawValue !== undefined && rawValue !== null) {
      const value = String(rawValue); // ✅ ensure string
      const locator = this.form.locator(`input[name="${name}"]`);
      await locator.fill(value);
      console.log(`✅ Filled input[name="${name}"] with: ${value}`);
    } else {
      console.error(`❌ Value for field ${name} is undefined`);
    }
    
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
  private randomizeEmail(email: string, randomString: (len: number) => string): string {
    const [local, domain] = email.split("@");
    return `${local}${randomString(3)}@${domain}`;
  }
  async fillFormWithRandomizedEmail(baseValue: any, credentials: any, randomString: (len: number) => string): Promise<void> {
  const name = credentials[baseValue.name];
  const email = this.randomizeEmail(credentials[baseValue.email], randomString);

  console.log('Filled Values:', {
    [baseValue.name]: name,
    [baseValue.email]: email,
  });

  await this.fillForm({
    [baseValue.name]: name,
    [baseValue.email]: email,
    });
  }
  async clickContinueButton(): Promise<void> {
    await this.page.locator(this.CONTINUE_BUTTON).click();
  }
}
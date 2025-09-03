import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {

    private page: Page;
    private ADDRESS_DETAILS: string;
    private COMMENT_BOX: string;
    private PLACE_ORDER_BUTTON: string;
    private fieldSelectors: { [key: string]: string };
    private NAME_ON_CARD: Locator;
    private CARD_NUMBER: Locator;
    private CVC: Locator;
    private EXPIRATION_MONTH: Locator;
    private EXPIRATION_YEAR: Locator;
    private CONFIRM_ORDER_BUTTON: Locator;
    private SUCCESS_MESSAGE: string;


  
    constructor(page: Page) {
        this.page = page;
        this.ADDRESS_DETAILS = '//div[@class="address item box"]';
        this.COMMENT_BOX = 'textarea[name="message"]';
        this.PLACE_ORDER_BUTTON = '//*[@href="/payment"]';
        this.fieldSelectors = {
            first_name: ".address_firstname address_lastname",
            last_name: "last_name",
            company: "company",
            address1: "address1",
            address2: "address2",
            country: ".address_country_name",
            state: "state",
            city: "city",
            zipcode: "zipcode",
            mobile_number: ".address_phone",
        }
        this.NAME_ON_CARD = this.page.locator('input[name="name_on_card"]');
        this.CARD_NUMBER = this.page.locator('input[name="card_number"]');
        this.CVC = this.page.locator('input[name="cvc"]');
        this.EXPIRATION_MONTH = this.page.locator('input[name="expiry_month"]');
        this.EXPIRATION_YEAR = this.page.locator('input[name="expiry_year"]');
        this.CONFIRM_ORDER_BUTTON = this.page.locator('button#submit');
        this.SUCCESS_MESSAGE = 'Congratulations! Your order has been confirmed!';
}   

    get AddressDetails(): Locator {
      return this.page.locator(this.ADDRESS_DETAILS);
    }
 async validateCheckoutInfo(expectedData: Record<string, string>): Promise<void> {
    for (const [field, selector] of Object.entries(this.fieldSelectors)) {
      const expectedValue = expectedData[field];
      if (!expectedValue) {
        console.warn(`⚠️ Skipping ${field}, no value found in CSV`);
        continue;
      }

      const locator = this.page.locator(selector);

      // Get value or text
      const actualValue = await locator.inputValue().catch(async () => {
        return locator.innerText(); // fallback if not input
      });

      console.log(`Field: ${field}, Expected: ${expectedValue}, Actual: ${actualValue}`);

      await expect(actualValue.trim()).toBe(expectedValue.trim());
    }
  }
    async enterComment(comment: string): Promise<void> {
      await this.page.locator(this.COMMENT_BOX).fill(comment);
    }
    async placeOrder(): Promise<void> {
      await this.page.locator(this.PLACE_ORDER_BUTTON).click();
    }
    
    async enterPaymentDetails(details: {
        name_on_card: string;
        card_number: string;
        cvc: string;
        expiration_month: string;
        expiration_year: string;    
    }): Promise<void> {
        await this.NAME_ON_CARD.fill(details.name_on_card);
        await this.CARD_NUMBER.fill(details.card_number);
        await this.CVC.fill(details.cvc);
        await this.EXPIRATION_MONTH.fill(details.expiration_month);
        await this.EXPIRATION_YEAR.fill(details.expiration_year);
    }
    async confirmOrder(): Promise<void> {
        await this.CONFIRM_ORDER_BUTTON.click();
        await this.page.waitForTimeout(500); // wait for processing
        await expect(this.page.locator(`text=${this.SUCCESS_MESSAGE}`)).toBeVisible();
    }
}

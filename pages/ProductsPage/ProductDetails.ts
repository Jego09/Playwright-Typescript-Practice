import { Page, Locator, expect } from '@playwright/test';


export class ProductDetails {
    private page: Page;
    private QUANTITY: string;
    private ADD_TO_CART_BUTTON: string;

    constructor(page: Page) {
        this.page = page;
        this.QUANTITY = '#quantity'
        this.ADD_TO_CART_BUTTON = '//button[@type="button"]';
        
    }

    get productInformation(): Locator {
        return this.page.locator('//div[@class="product-information"]');
    }
    async changeQuantity(quantity: number): Promise<void> {
        await this.productInformation.locator(this.QUANTITY).fill((quantity).toString());
        console.log(`Changed quantity to: ${quantity}`);
    }
    async addToCart(): Promise<void> {
        await this.productInformation.locator(this.ADD_TO_CART_BUTTON).click();
    }
    async continueShopping(): Promise<void> {
        await this.page.getByText('Continue Shopping').click();
        console.log('Clicked on Continue Shopping button');
    }
}
import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();


export class ProductPage {
    private page: Page;
    private FEATURED_ITEMS: string;
    private VIEW_PRODUCT_BUTTON: (index: number) => string;
    private PRODUCT_INFORMATION: string;
    private PRODUCT_SEARCH_FIELD: string;
    private SEARCH_BUTTON: string;
    public PRODUCT_NAME: (name: string) => string;
    private PRODUCT_COUNT: string;
    private ADD_TO_CART_BUTTON: (index: number) => string;
    public CONTINUE_SHOPPING_BUTTON: string;
    private OVERLAY_CONTENT: string; // For Add to Cart Modal

    constructor(page: Page) {
        this.page = page;
        this.FEATURED_ITEMS = "features_items";
        this.VIEW_PRODUCT_BUTTON = (index: number) => `//a[@href="/product_details/${index}"]`;
        this.PRODUCT_INFORMATION = '//div[@class="product-information"]';
        this.PRODUCT_SEARCH_FIELD = '//input[@id="search_product"]';
        this.SEARCH_BUTTON = '//button[@id="submit_search"]';
        this.PRODUCT_NAME = (name: string) => `//div[@class="productinfo text-center"][.//p[contains(text(), "${name}")]]`;
        this.PRODUCT_COUNT = '.features_items .product-image-wrapper';
        this.ADD_TO_CART_BUTTON = (index: number) => `//a[@data-product-id=${index}]//a[@text="Add to cart"]`;
        this.CONTINUE_SHOPPING_BUTTON = "Continue Shopping";
        this.OVERLAY_CONTENT = '.overlay-content'; // For Add to Cart Modal

        
    }

    get featuredItems(): Locator {
        return this.page.locator(`//div[@class="${this.FEATURED_ITEMS}"]`);
    }
    get modalContent(): Locator {
        return this.page.locator('.modal-content');
    }
    get overlayContent(): Locator {
        return this.page.locator(this.OVERLAY_CONTENT);
    }

    get productCount(): Locator {
        return this.page.locator(this.PRODUCT_COUNT);
    }

    async product(count: number): Promise<void> {
        const products = this.page.locator(this.PRODUCT_COUNT).nth(count);
        await products.hover();
        await products.locator('text=Add to cart').first().click();

    }
    async clickViewProductButton(index: number): Promise<void> {

        const button = await this.page.locator(this.VIEW_PRODUCT_BUTTON(index));
        await button.click();
        await expect(this.page.locator(this.PRODUCT_INFORMATION)).toBeVisible();
    }

    async fillSearchField(field: string): Promise<void> {
        const searchField = this.page.locator(this.PRODUCT_SEARCH_FIELD);
        await searchField.click();
        await expect(searchField).toBeVisible();
        await searchField.fill(field);
        await this.page.locator(this.SEARCH_BUTTON).click();
    }
    async clickViewCartButton(): Promise<void> {
        await this.modalContent.getByText('View Cart').click();
    }
}





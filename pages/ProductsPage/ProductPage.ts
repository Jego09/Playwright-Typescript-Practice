import { Page, Locator, expect } from '@playwright/test';
import { ProductLocators } from './ProductsLocators';
import dotenv from 'dotenv';
dotenv.config();


export class ProductPage {
    private page: Page;

    private P = ProductLocators;
    constructor(page: Page) {
        this.page = page;
    }

    async clickViewProductButton(index: number): Promise<void> {

        const button = await this.page.locator(this.P.ViewProductButton(index));
        await button.click();
        await expect(this.page.locator(this.P.ProductInformation)).toBeVisible();
    }

    async fillSearchField(field: string): Promise<void> {
        const searchButton = this.page.locator(this.P.ProductSearchField);
        await searchButton.click();
        await expect(searchButton).toBeVisible();
        await searchButton.fill(field);
        await this.page.locator(this.P.SearchButton).click();
    }
}




export const ProductLocators = {
    
  ViewProductButton: (index: number) => `//a[@href="/product_details/${index}"]`,
  ProductInformation: '//div[@class="product-information"]',
  ProductSearchField: '//input[@id="search_product"]',
  ProductName: (name: string) => `//div[@class="productinfo text-center"][.//p[contains(text(), "${name}")]]`,
  SearchButton: '//button[@id="submit_search"]',
}


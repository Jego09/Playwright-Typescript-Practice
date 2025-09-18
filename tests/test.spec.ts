import { test, expect, defineConfig } from '@playwright/test';
import { getTestDataFromCSV, getTestdataFromJsonfile } from '../utils/csvReader';
import { randomString } from '../utils/data';
import { HomePage } from '../pages/Homepage/HomePage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import  SignupPage  from '../pages/SignUpPage/SignupPage';
import { AccountInformationPage } from '../pages/SignUpPage/AccountInformationPage';
import { baseValue, commonData } from '../utils/common';
import dotenv from 'dotenv';
import { ContactUsPage } from '../pages/ContactUsPage/ContactUsPage';
import { ContactLocators } from '../pages/ContactUsPage/Contact-Locators';
import { ProductPage } from '../pages/ProductsPage/ProductPage';
import { CartPage } from '../pages/CartPage/CartPage';
import { ProductDetails } from '../pages/ProductsPage/ProductDetails';
import { Sign, sign } from 'crypto';
import { CheckoutPage } from '../pages/CheckoutPage/CheckoutPage';

dotenv.config();


test.describe('Register User', () => {

  const allCredentials = getTestDataFromCSV('testdata/signup.csv');

  allCredentials.forEach((credentials) => {
    
    test(`TC_1 Register User with ${credentials[baseValue.name]}`, async ({ page }) => {

      const homePage = new HomePage(page);
      await homePage.goto();
      await homePage.clickLoginButton();

      const loginPage = new LoginPage(page);
      await loginPage.expectToBeVisible();

      const signupPage = new SignupPage(page);
      await signupPage.fillFormWithRandomizedEmail(baseValue, credentials, randomString);
      await signupPage.submitForm();

      const accountInformationPage = new AccountInformationPage(page);
      await accountInformationPage.expectToBeVisible();

      const accountInformation = getTestDataFromCSV('testdata/AccountInformation.csv');
      const accountInfo = accountInformation[0]; // get the first row
      
      await accountInformationPage.fillForm(accountInfo);
      await accountInformationPage.submitForm();
      await accountInformationPage.AccountCreatedValidation();

      await signupPage.clickContinueButton();

      await homePage.getLoggedInName();
      await homePage.expectLoggedInName(credentials[baseValue.name]);
    });
  });
});


test.describe('Login Tests', () => {

test('TC_2 Login user with correct credentials', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectLoginToYourAccount();
  await loginPage.enterCredentials(); 
  await loginPage.clickLoginButton();

  await homePage.getLoggedInName();
  await homePage.expectLoggedInName(process.env.NAME!);

  // await homePage.deleteAccountAndValidate();

  // await page.getByText(baseValue.continue).click();

});

test('TC_3 Login user with incorrect credentials', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectLoginToYourAccount();
  await loginPage.enterIncorrectCredentials();

    
  });
});

test('TC_4 Logout User', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectLoginToYourAccount();
  await loginPage.enterCredentials();
  await loginPage.clickLoginButton();

  await homePage.getLoggedInName();
  await homePage.expectLoggedInName(process.env.NAME!);
  await homePage.clickLogoutButton();

  await loginPage.expectLoginToYourAccount();

});

test('TC_5 Register User with existing email', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectToBeVisible();

  const signupPage = new SignupPage(page);
  
  await signupPage.fillForm({

    [baseValue.name]: process.env.NAME!,
    [baseValue.email]: process.env.EMAIL!,

  });

  console.log('Filled Values:', {
    [baseValue.name]: process.env.NAME!,
    [baseValue.email]: process.env.EMAIL!,
  });
  
  await signupPage.submitForm();
  await signupPage.emailDuplicateErrorMessage();  

});

test('TC_6 Contact Us Form', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickContactUsButton();

  const contactUs = new ContactUsPage(page);

  await contactUs.formToBeVisible();

  await contactUs.fillContactForm({
    name: commonData.name,
    email: commonData.email,
    subject: ContactLocators.subjectInput,
    message: ContactLocators.messageInput,

  });

  await page.waitForTimeout(2000);

  await contactUs.submitContactForm();
  
  await page.waitForTimeout(2000);

  await contactUs.expectSuccessMessage();

  await homePage.clickHomeButton();

  await homePage.expectPageToBeVisible();

});

test('TC_7 Verify Test Case Page', async ({ page }) => {

  const homePage = new HomePage(page);

  await homePage.goto();

  await homePage.clickTestCaseButton();

});

test('TC_8 Verify All Products and product detail page', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto(); 
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.clickViewProductButton(1);

});

test('TC_9 Search Product', async ({ page }) => {

  const items = getTestdataFromJsonfile('testdata/items.json');
  const item = items.find((item: any) => item.id === 1); // or add type

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.fillSearchField(item.name); // Item name from JSON
  console.log('Searching for product:', item.name);
  await page.waitForTimeout(2000);  
  await expect(page.locator(productPage.PRODUCT_NAME(item.name))).toBeVisible();

});

test('TC_10 Verify Subscription in home page', async ({ page }) => {

  const emails = getTestdataFromJsonfile('testdata/TestEmails.json');
  const email = emails.find((email: any) => email.id === 1); // or add type

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.validateSubscriptionText();
  await homePage.fillSubscriptionField(email.email);

});

test('TC_11 Verify Subscription in Cart page', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickCartButton();
  
  const cartPage = new CartPage(page);
  await expect(cartPage.subscriptionText).toBeVisible();
  await cartPage.FillEmailField('BjPwI@example.com');
});

test('TC_12 Add Products in Cart', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.AddToCartProduct(0);
  await page.getByText(productPage.CONTINUE_SHOPPING_BUTTON).click();
  await productPage.AddToCartProduct(1);

  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.validateCartItems('Blue Top');
  await cartPage.validateCartItems('Men Tshirt');
  
});

test('TC_13 Verify Product quantity in Cart', async ({ page }) => {

  const quantity = 6;

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.clickViewProductButton(1);

  const productDetails = new ProductDetails(page);
  await productDetails.changeQuantity(quantity);
  await productDetails.addToCart(); // Click Add to Cart button
  await page.waitForTimeout(1000); // Wait for modal to appear
  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.validateCartQuantity(0, quantity);

});

test ('TC_14 Place Order: Register while Checkout', async ({ page }) => {

  const allCredentials = getTestDataFromCSV('testdata/signup.csv');
  const credentials = allCredentials[0]; // Use the first set of credentials

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.clickViewProductButton(1);

  const productDetails = new ProductDetails(page);
  await productDetails.addToCart(); // Click Add to Cart button
  await page.waitForTimeout(1000); // Wait for modal to appear
  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.clickCheckoutButton();
  await cartPage.clickRegisterLoginButton();

  await page.waitForTimeout(2000); // Wait for navigation to complete

  const signupPage = new SignupPage(page);
  await signupPage.fillFormWithRandomizedEmail(baseValue, credentials, randomString);
  await signupPage.submitForm();

  const accountInformationPage = new AccountInformationPage(page);
  await accountInformationPage.expectToBeVisible();

  const accountInformation = getTestDataFromCSV('testdata/AccountInformation.csv');
  const accountInfo = accountInformation[0];
  await accountInformationPage.fillForm(accountInfo);
  await accountInformationPage.submitForm();
  await accountInformationPage.AccountCreatedValidation();
  await page.waitForTimeout(1000); // Wait for navigation to complete
  await signupPage.clickContinueButton();

  await homePage.getLoggedInName();
  await homePage.expectLoggedInName(credentials[baseValue.name]);
  await homePage.clickCartButton();

  await cartPage.clickCheckoutButton();

  const checkoutPage = new CheckoutPage(page);
  const checkoutInformation = getTestDataFromCSV("testdata/AccountInformation.csv");
  const checkoutInfo = checkoutInformation[0]; // Use the first row for checkout

  // Validate values
  await checkoutPage.validateCheckoutInfo(checkoutInfo);
  // Enter comment and place order
  await checkoutPage.enterComment("This is a test order.");
  await checkoutPage.placeOrder();

  //: Name on Card, Card Number, CVC, Expiration date
  await checkoutPage.enterPaymentDetails({
    name_on_card: "John Doe",
    card_number: "4111111111111111",
    cvc: "123",
    expiration_month: "12",
    expiration_year: "2025",
  });

  await checkoutPage.confirmOrder();
  
  await page.waitForTimeout(1000);

  await homePage.deleteAccountAndValidate();

});

test('TC_15 Place Order: Register before Checkout', async ({ page }) => {

    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickLoginButton();

    const signupPage = new SignupPage(page);
    await signupPage.fillFormWithRandomizedEmail(baseValue, {
      [baseValue.name]: process.env.NAME!,
      [baseValue.email]: process.env.EMAIL!,
    }, randomString);
    await signupPage.submitForm();

    const accountInformationPage = new AccountInformationPage(page);
    await accountInformationPage.expectToBeVisible();

    const accountInformation = getTestDataFromCSV('testdata/AccountInformation.csv');
    const accountInfo = accountInformation[0];
    await accountInformationPage.fillForm(accountInfo);
    await accountInformationPage.submitForm();
    await accountInformationPage.AccountCreatedValidation();
    await page.waitForTimeout(1000); // Wait for navigation to complete
    await signupPage.clickContinueButton();

    await homePage.getLoggedInName();
    await homePage.expectLoggedInName(process.env.NAME!);

    const productPage = new ProductPage(page);
    await productPage.clickViewProductButton(1);
    const productDetails = new ProductDetails(page);
    await productDetails.addToCart(); // Click Add to Cart button
    await page.waitForTimeout(1000); // Wait for modal to appear
    await productPage.clickViewCartButton();

    const cartPage = new CartPage(page);
    await cartPage.clickCheckoutButton();

    const checkoutPage = new CheckoutPage(page);
    const checkoutInformation = getTestDataFromCSV("testdata/AccountInformation.csv");
    const checkoutInfo = checkoutInformation[0]; // Use the first row for checkout

    // Validate values
    await checkoutPage.validateCheckoutInfo(checkoutInfo);
    // Enter comment and place order
    await checkoutPage.enterComment("This is a test order.");
    await checkoutPage.placeOrder();

    //: Name on Card, Card Number, CVC, Expiration date
    await checkoutPage.enterPaymentDetails({
      name_on_card: "John Doe",
      card_number: "4111111111111111",
      cvc: "123",
      expiration_month: "12",
      expiration_year: "2025",
    });
    await checkoutPage.confirmOrder();
    
    await page.waitForTimeout(1000);

    await homePage.deleteAccountAndValidate();
});

test('TC_16 Place Order: Login before Checkout', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectLoginToYourAccount();
  await loginPage.enterCredentials();
  await loginPage.clickLoginButton();

  await homePage.getLoggedInName();
  await homePage.expectLoggedInName(process.env.NAME!);

  const productPage = new ProductPage(page);
  await productPage.clickViewProductButton(1);
  const productDetails = new ProductDetails(page);
  await productDetails.addToCart();

  await page.waitForTimeout(1000); // Wait for modal to appear
  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.clickCheckoutButton();

  const checkoutPage = new CheckoutPage(page);
  const checkoutInformation = getTestDataFromCSV("testdata/AccountInformation.csv");
  const checkoutInfo = checkoutInformation[0]; // Use the first row for checkout

  // Validate values
  await checkoutPage.validateCheckoutInfo(checkoutInfo);
  // Enter comment and place order
  await checkoutPage.enterComment("This is a test order.");
  await checkoutPage.placeOrder();

  //: Name on Card, Card Number, CVC, Expiration date
  await checkoutPage.enterPaymentDetails({
    name_on_card: "John Doe",
    card_number: "4111111111111111",
    cvc: "123",
    expiration_month: "12",
    expiration_year: "2025",
  });
  await checkoutPage.confirmOrder();
  
  await page.waitForTimeout(1000);

  await homePage.deleteAccountAndValidate();

});

test('TC_17 Remove Products From Cart', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.AddToCartProduct(0);
  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.validateCartItems('Blue Top');
  await cartPage.removeItemFromCart('Blue Top');
  await page.waitForTimeout(1000);

});
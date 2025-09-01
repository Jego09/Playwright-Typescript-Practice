import { test, expect, defineConfig } from '@playwright/test';
import { getTestDataFromCSV, getTestdataFromJsonfile } from '../utils/csvReader';
import { randomString } from '../utils/data';
import { HomePage } from '../pages/Homepage/HomePage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import  SignupPage  from '../pages/SignUpPage/SignupPage';
import { AccountInformationPage } from '../pages/SignUpPage/AccountInformationPage';
import { SignUpLocators } from '../pages/SignUpPage/SignUpLocators';
import { baseValue, commonData } from '../utils/common';
import dotenv from 'dotenv';
import { ContactUsPage } from '../pages/ContactUsPage/ContactUsPage';
import { ContactLocators } from '../pages/ContactUsPage/Contact-Locators';
import { ProductPage } from '../pages/ProductsPage/ProductPage';
import { CartPage } from '../pages/ContactUsPage/CartPage/CartPage';

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
      await signupPage.fillForm({

      [baseValue.name]: credentials[baseValue.name + randomString(3)],
      [baseValue.email]: credentials[baseValue.email + randomString(3)],

      });

      await signupPage.submitForm();

      const accountInformationPage = new AccountInformationPage(page);
      await accountInformationPage.expectToBeVisible();
      const accountInformation = getTestDataFromCSV('testdata/AccountInformation.csv');
      const accountInfo = accountInformation[0]; // get the first row
      await accountInformationPage.fillForm(accountInfo);
      await accountInformationPage.submitForm();
      await accountInformationPage.AccountCreatedValidation();

      const continueButton = page.locator(SignUpLocators.ContinueButton);
      await continueButton.click();

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

  await homePage.deleteAccountAndValidate();

  await page.getByText(baseValue.continue).click();

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
  await cartPage.FillEmailField();
});

test('TC_12 Add Products in Cart', async ({ page }) => {

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickProductsButton();

  const productPage = new ProductPage(page);
  await productPage.product(0);
  await page.getByText(productPage.CONTINUE_SHOPPING_BUTTON).click();
  await productPage.product(1);

  await productPage.clickViewCartButton();

  const cartPage = new CartPage(page);
  await cartPage.validateCartItems('Blue Top');
  await cartPage.validateCartItems('Men Tshirt');
});


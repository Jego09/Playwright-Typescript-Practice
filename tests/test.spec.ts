import { test, expect } from '@playwright/test';
import { getTestDataFromCSV } from '../utils/csvReader';
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

dotenv.config();


test('TC_1 Register User', async ({ page }) => {

  const allCredentials = getTestDataFromCSV('testdata/signup.csv');
  const credentials = allCredentials[0]; // get the first row

  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await loginPage.expectToBeVisible();

  const signupPage = new SignupPage(page);
  const filledValues: Record<string, string> = {};

    for (const [name, value] of Object.entries(credentials)) {

      if (name === baseValue.ID) continue;

      const filledValue = value + randomString(5);

      filledValues[name] = filledValue;
    }

  await signupPage.fillForm(filledValues);
  console.log('Filled Values:', filledValues);
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
  await homePage.expectLoggedInName(filledValues[baseValue.name]); 

  // await homePage.deleteAccountAndValidate();
  // await page.getByText(baseValue.continue).click();

});

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

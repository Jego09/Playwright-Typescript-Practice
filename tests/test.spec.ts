import { test, expect } from '@playwright/test';
import { getTestDataFromCSV } from '../utils/csvReader';
import { randomString } from '../utils/data';
import { HomePage } from '../pages/Homepage/HomePage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import  SignupPage  from '../pages/SignUpPage/SignupPage';
import { AccountInformationPage } from '../pages/SignUpPage/AccountInformationPage';
import { SignUpLocators } from '../pages/SignUpPage/SignUpLocators';
import { baseValue } from '../utils/common';
import dotenv from 'dotenv';

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

  await accountInformationPage.getLoggedInName();

    await accountInformationPage.expectLoggedInName(filledValues[baseValue.name]); 

  await homePage.deleteAccountAndValidate();
  
      await page.getByText(baseValue.continue).click();

});

test('TC_2 Login', async ({ page }) => {

  const homePage = new HomePage(page);

    await homePage.goto();

      await homePage.expectPageToBeVisible();

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


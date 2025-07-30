import { test, expect } from '@playwright/test';
import { env } from '../utils/env';
import { getTestDataFromCSV } from '../utils/csvReader';
import { randomString } from '../utils/data';
import { HomePage } from '../pages/Homepage/HomePage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import  SignupPage  from '../pages/SignUpPage/SignupPage';
import { AccountInformationPage } from '../pages/SignUpPage/AccountInformationPage';
import { SignUpLocators } from '../pages/SignUpPage/SignUpLocators';
import { baseValue } from '../utils/common';


test('TC_1 Register User', async ({ page }) => {

  const allCredentials = getTestDataFromCSV('testdata/signup.csv');
  const credentials = allCredentials[0]; // get the first row

  await page.goto(env.baseURL!);

  const homePage = new HomePage(page);
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

  await homePage.clickDeleteAccount();

  await homePage.accountDeletedValidation();
  
  await page.getByText(baseValue.continue).click();

});

// test('TC_2 Login', async ({ page }) => {

//   const loginpage = new SignUpLoginPage(page);

//   await loginpage.goto();
//   await expect(page).toHaveTitle(/Automation Exercise/);
//   await loginpage.login(LoginLocators.EmailInput, LoginLocators.PasswordInput);

// });


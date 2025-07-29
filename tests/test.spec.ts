import { test, expect } from '@playwright/test';
import { env } from '../utils/env';
// import { HomePageLocators } from '../locators/Homepage-Locators';
import { getTestDataFromCSV } from '../utils/csvReader';
import { randomString } from '../utils/data';
// import { LoginLocators, SignUpLocators } from '../locators/SignUp-Login-Locators';
// import { SignUpLoginPage } from '../pages/SignUp-Login';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import  SignupPage  from '../pages/SignupPage';
import { AccountInformationPage } from '../pages/AccountInformationPage';
import { SignUpLocators } from '../locators/SignUp-Login-Locators';


test('TC_1 Register User', async ({ page }) => {

  const allCredentials = getTestDataFromCSV('testdata/signup.csv');
  const credentials = allCredentials[0]; // get the first row

  await page.goto(env.baseURL!);

  const homePage = new HomePage(page);
  await homePage.clickLoginButton();

  const loginPage = new LoginPage(page);
  await expect(loginPage.newSignupButton).toBeVisible();

  const signupPage = new SignupPage(page);
  const filledValues: Record<string, string> = {};

  for (const [name, value] of Object.entries(credentials)) {
    if (name === 'ID') continue;

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

  await expect(page.getByText('Account Created!')).toBeVisible();

  const continueButton = page.locator(SignUpLocators.ContinueButton);
  await continueButton.click();

  const filledName = filledValues["name"];
  const loggedInName = await page.locator('text=Logged in as').locator('b').textContent();

  expect(loggedInName?.trim()).toBe(filledName);
});

// test('TC_2 Login', async ({ page }) => {

//   const loginpage = new SignUpLoginPage(page);

//   await loginpage.goto();
//   await expect(page).toHaveTitle(/Automation Exercise/);
//   await loginpage.login(LoginLocators.EmailInput, LoginLocators.PasswordInput);

// });


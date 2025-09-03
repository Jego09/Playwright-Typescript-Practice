import { Page } from '@playwright/test';

export function randomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


export function handlingAlertMessages(page: Page): void {
  page.once('dialog', async (dialog) => {
    console.log(dialog.message()); // Optional: Log the text
    await dialog.accept(); // This clicks "OK"
  });
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
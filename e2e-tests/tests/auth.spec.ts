import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test('should allow the user to ign in', async ({ page }) => {
  await page.goto(UI_URL);

  // Get the sign in link and click it.
  await page.getByRole('link', { name: 'Sign In' }).click();

  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.locator('[name=email]').fill('1@1.com');
  await page.locator('[name=password]').fill('123456');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('User signed in successfully')).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
});

test('should allow user to register', async ({ page }) => {
  const testEmail = `test_registration_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  // got to the this page
  await page.goto(UI_URL);

  // 1- get the sign in link and click it
  // 2- get the create an account link and click it
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Create an account here' }).click();

  // 3- get the heading and check if it is visible
  await expect(
    page.getByRole('heading', { name: 'Create an Account' })
  ).toBeVisible();

  // 4- fill the form
  await page.locator('[name=firstName]').fill('John');
  await page.locator('[name=lastName]').fill('Doe');
  await page.locator('[name=email]').fill(testEmail);
  await page.locator('[name=password]').fill('123456');
  await page.locator('[name=confirmPassword]').fill('123456');

  // 5- click the register button
  await page.getByRole('button', { name: 'Create Account' }).click();

  // 6- check if notification has the correct message
  // 7- check if the links are visible
  await expect(page.getByText('Account created successfully')).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
});

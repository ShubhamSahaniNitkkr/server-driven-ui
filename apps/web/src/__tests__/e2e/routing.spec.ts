import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('SDUI Platform').first()).toBeVisible({ timeout: 10000 });
}

test.describe('Dynamic Routing', () => {
  test('admin can navigate to all pages', async ({ page }) => {
    await login(page, 'admin@example.com', 'admin123');

    await page.getByTestId('nav-nav-users').click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

    await page.getByTestId('nav-nav-orders').click();
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

    await page.getByTestId('nav-nav-reports').click();
    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();

    await page.getByTestId('nav-nav-settings').click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('viewer cannot see create user button', async ({ page }) => {
    await login(page, 'viewer@example.com', 'viewer123');
    await page.getByTestId('nav-nav-users').click();
    await expect(page.getByTestId('create-user-btn')).not.toBeVisible();
  });

  test('admin can see create user button', async ({ page }) => {
    await login(page, 'admin@example.com', 'admin123');
    await page.getByTestId('nav-nav-users').click();
    await expect(page.getByTestId('create-user-btn')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

const AUTH_SIGNUP_REGEX = /signup$/;

test.describe('App Root Route', () => {
  test('redirects / to /signup', async ({ page }) => {
    const response = await page.goto('/');

    await expect(page).toHaveURL(AUTH_SIGNUP_REGEX);
    expect(response?.ok()).toBeTruthy();
  });

  test('renderiza header global e theme toggle após o redirect', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('button', { name: /alternar tema/i })).toBeVisible();
  });

  test('gera snapshot do estado inicial (light)', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('auth-signup-light.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('theme toggle alterna para dark', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /alternar tema/i });

    await expect(html).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
  });

  test('theme toggle retorna para light', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /alternar tema/i });

    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('gera snapshot completo em dark após troca de tema', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /alternar tema/i });
    await toggle.click();

    await expect(page).toHaveScreenshot('auth-signup-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mantém dark mode após reload', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /alternar tema/i });

    await toggle.click();
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(html).toHaveClass(/dark/);
  });

  test('mantém dark mode em nova aba', async ({ page, context }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /alternar tema/i });
    await toggle.click();

    await page.waitForFunction(() => localStorage.getItem('theme') === 'dark');

    const secondPage = await context.newPage();
    await secondPage.goto('/');
    await expect(secondPage.locator('html')).toHaveClass(/dark/);
    await secondPage.close();
  });

  test('gera snapshot do header em dark mode', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /alternar tema/i }).click();

    const secondPage = await context.newPage();
    await secondPage.goto('/');

    const header = secondPage.getByRole('banner');
    await expect(header).toHaveScreenshot('auth-header-dark.png', {
      animations: 'disabled',
    });

    await secondPage.close();
  });

  test('gera snapshot da camada de background em dark mode', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /alternar tema/i }).click();

    const secondPage = await context.newPage();
    await secondPage.goto('/');

    const background = secondPage.getByTestId('auth-layout-background');
    await expect(background).toHaveScreenshot('auth-background-layer.png', {
      animations: 'disabled',
    });

    await secondPage.close();
  });
});

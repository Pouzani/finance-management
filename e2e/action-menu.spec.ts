import { test, expect } from '@playwright/test';

const BASE = '/en/dashboard';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/en/login');
  await page.getByLabel(/username/i).fill('pouzanitest');
  await page.getByLabel(/password/i).fill('Pouzani0655678230+');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await page.waitForURL(`**${BASE}`);
}

test.describe('Action menu', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/transactions`);
    await page.waitForSelector('text=History');
  });

  test('dropdown is not visible until row is hovered', async ({ page }) => {
    const row = page.locator('[data-action-menu]').first();
    const trigger = row.getByRole('button');
    await expect(trigger).toHaveCSS('opacity', '0');

    await row.hover();
    await expect(trigger).toHaveCSS('opacity', '1');
  });

  test('dropdown opens below the trigger without clipping', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /actions for/i }).first();
    await trigger.hover();
    await trigger.click();

    const editBtn = page.getByRole('button', { name: 'Edit' });
    await expect(editBtn).toBeVisible();

    // Verify dropdown is fully within the viewport (not clipped)
    const box = await editBtn.boundingBox();
    expect(box).not.toBeNull();
    const viewport = page.viewportSize()!;
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  });

  test('clicking outside closes the dropdown', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /actions for/i }).first();
    await trigger.hover();
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();

    await page.mouse.click(100, 100);
    await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible();
  });

  test('clicking Edit opens the drawer pre-filled with transaction data', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /actions for/i }).first();
    await trigger.hover();
    await trigger.click();
    await page.getByRole('button', { name: 'Edit' }).click();

    // Drawer slides in
    const drawer = page.getByRole('dialog', { name: /edit transaction/i });
    await expect(drawer).toBeVisible();

    // Form is pre-filled
    await expect(page.getByRole('textbox', { name: /label/i })).not.toHaveValue('');
    await expect(page.getByRole('textbox', { name: /amount/i })).not.toHaveValue('');
  });

  test('closing the drawer hides it', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /actions for/i }).first();
    await trigger.hover();
    await trigger.click();
    await page.getByRole('button', { name: 'Edit' }).click();

    const drawer = page.getByRole('dialog', { name: /edit transaction/i });
    await expect(drawer).toBeVisible();

    await page.getByRole('button', { name: /close/i }).click();
    await expect(drawer).not.toBeVisible();
  });
});

test.describe('No rogue dialog on dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('dashboard has no open dialog on load', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('text=Recent Transactions');

    // No dialog should be open on initial load
    const dialogs = page.getByRole('dialog');
    await expect(dialogs).toHaveCount(0);
  });

  test('transactions page has no open dialog on load', async ({ page }) => {
    await page.goto(`${BASE}/transactions`);
    await page.waitForSelector('text=History');

    const dialogs = page.getByRole('dialog');
    await expect(dialogs).toHaveCount(0);
  });
});

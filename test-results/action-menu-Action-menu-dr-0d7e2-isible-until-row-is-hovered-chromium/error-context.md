# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: action-menu.spec.ts >> Action menu >> dropdown is not visible until row is hovered
- Location: e2e/action-menu.spec.ts:20:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/username/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img [ref=e7]
          - generic [ref=e9]: Personal Finance
        - heading "The Ledger" [level=1] [ref=e10]:
          - text: The
          - text: Ledger
        - paragraph [ref=e11]: Your personal financial atelier — manage, analyse and optimise your wealth with precision.
      - generic [ref=e12]:
        - img [ref=e13]
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Total assets
            - generic [ref=e24]: 124,500 MAD
          - generic [ref=e25]:
            - generic [ref=e26]: Growth
            - generic [ref=e27]: +18.4%
    - generic [ref=e29]:
      - generic [ref=e30]:
        - img [ref=e32]
        - heading "Sign in" [level=2] [ref=e34]
        - paragraph [ref=e35]: Access your financial atelier
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]: Username
          - textbox "your_name" [ref=e39]
        - generic [ref=e40]:
          - generic [ref=e41]: Password
          - textbox "••••••••" [ref=e42]
        - button "Sign in" [ref=e43] [cursor=pointer]
      - paragraph [ref=e44]:
        - text: Don't have an account?
        - link "Sign up" [ref=e45] [cursor=pointer]:
          - /url: /en/register
  - button "Open Next.js Dev Tools" [ref=e51] [cursor=pointer]:
    - img [ref=e52]
  - alert [ref=e55]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE = '/en/dashboard';
  4   | 
  5   | async function login(page: import('@playwright/test').Page) {
  6   |   await page.goto('/en/login');
> 7   |   await page.getByLabel(/username/i).fill('pouzanitest');
      |                                      ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  8   |   await page.getByLabel(/password/i).fill('Pouzani0655678230+');
  9   |   await page.getByRole('button', { name: /login|sign in/i }).click();
  10  |   await page.waitForURL(`**${BASE}`);
  11  | }
  12  | 
  13  | test.describe('Action menu', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await login(page);
  16  |     await page.goto(`${BASE}/transactions`);
  17  |     await page.waitForSelector('text=History');
  18  |   });
  19  | 
  20  |   test('dropdown is not visible until row is hovered', async ({ page }) => {
  21  |     const row = page.locator('[data-action-menu]').first();
  22  |     const trigger = row.getByRole('button');
  23  |     await expect(trigger).toHaveCSS('opacity', '0');
  24  | 
  25  |     await row.hover();
  26  |     await expect(trigger).toHaveCSS('opacity', '1');
  27  |   });
  28  | 
  29  |   test('dropdown opens below the trigger without clipping', async ({ page }) => {
  30  |     const trigger = page.getByRole('button', { name: /actions for/i }).first();
  31  |     await trigger.hover();
  32  |     await trigger.click();
  33  | 
  34  |     const editBtn = page.getByRole('button', { name: 'Edit' });
  35  |     await expect(editBtn).toBeVisible();
  36  | 
  37  |     // Verify dropdown is fully within the viewport (not clipped)
  38  |     const box = await editBtn.boundingBox();
  39  |     expect(box).not.toBeNull();
  40  |     const viewport = page.viewportSize()!;
  41  |     expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  42  |     expect(box!.x).toBeGreaterThanOrEqual(0);
  43  |     expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  44  |   });
  45  | 
  46  |   test('clicking outside closes the dropdown', async ({ page }) => {
  47  |     const trigger = page.getByRole('button', { name: /actions for/i }).first();
  48  |     await trigger.hover();
  49  |     await trigger.click();
  50  |     await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  51  | 
  52  |     await page.mouse.click(100, 100);
  53  |     await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible();
  54  |   });
  55  | 
  56  |   test('clicking Edit opens the drawer pre-filled with transaction data', async ({ page }) => {
  57  |     const trigger = page.getByRole('button', { name: /actions for/i }).first();
  58  |     await trigger.hover();
  59  |     await trigger.click();
  60  |     await page.getByRole('button', { name: 'Edit' }).click();
  61  | 
  62  |     // Drawer slides in
  63  |     const drawer = page.getByRole('dialog', { name: /edit transaction/i });
  64  |     await expect(drawer).toBeVisible();
  65  | 
  66  |     // Form is pre-filled
  67  |     await expect(page.getByRole('textbox', { name: /label/i })).not.toHaveValue('');
  68  |     await expect(page.getByRole('textbox', { name: /amount/i })).not.toHaveValue('');
  69  |   });
  70  | 
  71  |   test('closing the drawer hides it', async ({ page }) => {
  72  |     const trigger = page.getByRole('button', { name: /actions for/i }).first();
  73  |     await trigger.hover();
  74  |     await trigger.click();
  75  |     await page.getByRole('button', { name: 'Edit' }).click();
  76  | 
  77  |     const drawer = page.getByRole('dialog', { name: /edit transaction/i });
  78  |     await expect(drawer).toBeVisible();
  79  | 
  80  |     await page.getByRole('button', { name: /close/i }).click();
  81  |     await expect(drawer).not.toBeVisible();
  82  |   });
  83  | });
  84  | 
  85  | test.describe('No rogue dialog on dashboard', () => {
  86  |   test.beforeEach(async ({ page }) => {
  87  |     await login(page);
  88  |   });
  89  | 
  90  |   test('dashboard has no open dialog on load', async ({ page }) => {
  91  |     await page.goto(BASE);
  92  |     await page.waitForSelector('text=Recent Transactions');
  93  | 
  94  |     // No dialog should be open on initial load
  95  |     const dialogs = page.getByRole('dialog');
  96  |     await expect(dialogs).toHaveCount(0);
  97  |   });
  98  | 
  99  |   test('transactions page has no open dialog on load', async ({ page }) => {
  100 |     await page.goto(`${BASE}/transactions`);
  101 |     await page.waitForSelector('text=History');
  102 | 
  103 |     const dialogs = page.getByRole('dialog');
  104 |     await expect(dialogs).toHaveCount(0);
  105 |   });
  106 | });
  107 | 
```
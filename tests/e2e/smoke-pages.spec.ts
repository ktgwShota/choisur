import { expect, test } from '@playwright/test';

const STATIC_PATHS = ['/', '/demo', '/faq', '/about', '/terms', '/privacy'] as const;

test.describe('スモーク: 静的ページ', () => {
  for (const path of STATIC_PATHS) {
    test(`${path} が読み込める`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'load' });
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('トップのヘッダーに主要ナビリンクが表示される', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: '日程調整' })).toBeVisible();
    await expect(header.getByRole('link', { name: '多数決' })).toBeVisible();
  });
});

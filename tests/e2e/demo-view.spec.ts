import { expect, test } from '@playwright/test';

test.describe('デモ: シード済みページ', () => {
  test('多数決デモが表示され見出しが期待どおり含まれる', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/polls/demo', { waitUntil: 'load' });
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).toContainText(/どこ|お店|投票|多数決/);
  });

  test('日程調整デモが表示され見出しが期待どおり含まれる', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/schedule/demo', { waitUntil: 'load' });
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).toContainText(/いつ|日程|忘年会|調整/);
  });
});

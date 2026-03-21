import { expect, test } from '@playwright/test';

test('多数決の作成に成功する', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('/polls/create', { waitUntil: 'load' });

  const titleInput = page.getByPlaceholder('歓迎会のお店はどこがいい？');
  await expect(titleInput).toBeVisible();
  await titleInput.click();
  await titleInput.fill('E2Eテスト用の多数決');
  await expect(titleInput).toHaveValue('E2Eテスト用の多数決', { timeout: 15000 });

  await page.getByPlaceholder('レストラン A').first().fill('候補A');
  await page.getByPlaceholder('レストラン A').nth(1).fill('候補B');

  const submitButton = page.getByRole('button', { name: '投票ページを作成' });
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click();

  await page.waitForURL(/\/polls\/(?!create)[a-zA-Z0-9_-]+\/?$/, { timeout: 30000 });

  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByRole('heading', { level: 1, name: 'E2Eテスト用の多数決' })).toBeVisible({
    timeout: 15000,
  });
});

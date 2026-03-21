import { expect, test } from '@playwright/test';

test('日程調整の作成に成功する', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('/schedule/create', { waitUntil: 'load' });

  const titleInput = page.locator('input[name="title"]');
  await expect(titleInput).toBeVisible();
  await titleInput.click();
  await titleInput.fill('E2Eテスト用の日程調整');
  await expect(titleInput).toHaveValue('E2Eテスト用の日程調整', { timeout: 15000 });

  // カレンダーは「◯月 YYYY」という名前の grid（他 UI の grid と取り違えない）
  const calendarGrid = page.getByRole('grid', { name: /\d+月\s+\d{4}/ });
  await expect(calendarGrid).toBeVisible();
  const dayButtons = calendarGrid.locator('button:not([disabled]):has(time)');
  // 「今日」単独クリックが WebKit で不安定なことがあるため、2 件目があればそちら（翌日）を優先
  const count = await dayButtons.count();
  const pickIndex = count > 1 ? 1 : 0;
  await dayButtons.nth(pickIndex).click();

  await expect(page.getByTestId('schedule-candidate-selected')).toBeVisible({ timeout: 15000 });

  const submitButton = page.getByRole('button', { name: '出欠表を作成' });
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click();

  await page.waitForURL(/\/schedule\/(?!create)[a-zA-Z0-9_-]+\/?$/, { timeout: 30000 });

  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByRole('heading', { level: 1, name: 'E2Eテスト用の日程調整' })).toBeVisible({
    timeout: 15000,
  });
});

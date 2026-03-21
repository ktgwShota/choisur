import { expect, test } from '@playwright/test';

/**
 * 実 DB への書き込みを伴うため、ローカルで `npm run db:setup` 済みであることが前提。
 * ユニットの ContactForm テストがバリデーションを担い、本 E2E は成功パス 1 本に限定する。
 */
test('お問い合わせフォームが送信できる', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('/contact', { waitUntil: 'load' });

  await page.getByLabel('お名前').fill('E2E 送信テスト');
  await page.getByLabel('メールアドレス').fill('e2e-contact@example.com');
  await page.getByLabel('件名').fill('Playwright からのお問い合わせ');
  await page.getByLabel('お問い合わせ内容').fill('これは10文字以上の本文です。');

  await page.getByRole('button', { name: '送信する' }).click();

  await expect(page.getByText('お問い合わせを受け付けました。ありがとうございます。')).toBeVisible({
    timeout: 30000,
  });
});

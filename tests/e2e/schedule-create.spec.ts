import { expect, test } from '@playwright/test';

test('create a new schedule successfully', async ({ page }) => {
  // 1. Navigate to the schedule creation page
  await page.goto('/schedule/create');

  // 2. Fill in the title
  await page.getByPlaceholder('忘年会の日程はいつがいい？').fill('Playwright Test Event');

  // 3. Select a date
  // Find date buttons that contain a <time> element
  // We skip disabled buttons automatically by Playwright's actionability checks,
  // but let's strictly target non-disabled ones if possible.
  // In the implementation, disabled dates have 'pointer-events-none', so checking for that class helps,
  // or simply rely on Playwright finding the first clickable one.

  // Wait for the calendar to appear
  await expect(page.locator('button:has(time)').first()).toBeVisible();

  // Click the first available date (that is not disabled/pointer-events-none)
  await page.locator('button:has(time):not(.pointer-events-none)').first().click();

  // 4. Click the submit button
  await page.getByRole('button', { name: 'ページを作成' }).click();

  // 5. Verify Successful Creation
  // Expect URL to redirect to /schedule/[id]
  await expect(page).toHaveURL(/\/schedule\/[a-zA-Z0-9_-]+$/);

  // Verify the title is present on the result page
  await expect(page.getByRole('heading', { name: 'Playwright Test Event' })).toBeVisible();
});

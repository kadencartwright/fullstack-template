import { expect, test } from '@playwright/test'

test('loads the starter homepage', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('fullstack-template')
  await expect(
    page.getByRole('heading', {
      name: 'Full-stack starter with real auth, shared UI, and a separate Storybook app.',
    })
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Starter checklist' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Protected example' })).toBeVisible()
})

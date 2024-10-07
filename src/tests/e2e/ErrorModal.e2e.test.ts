import { test, expect } from '@playwright/test'
import mockApiResponses from '#tests/e2e/mocks'
import i18n from '#src/i18n'

test.describe('ErrorModal', () => {
	// Before each test, mock the API responses and navigate to the main page
	test.beforeEach(async ({ page }) => {
		await mockApiResponses(page) // Use mocked API responses
		await page.goto('/')
	})

	// ErrorModal Tests
	test('should display ErrorModal when an error occurs during post deletion', async ({ page }) => {
		// Intercept the delete post request and force it to fail
		await page.route('**/posts/*', (route) => route.abort('failed'))

		// Click the delete button on the first post
		await page.click(`button:has-text("${i18n.t('user.delete')}")`)

		// Wait for a brief moment to let the modal render
		await page.waitForSelector('[data-testid="error-modal-content"]', { state: 'visible' })

		// Use a more specific locator by targeting the modal content
		const modal = page.locator('[data-testid="error-modal-content"]')

		// Ensure the error modal heading appears using hasText
		await expect(modal.locator('h6').filter({ hasText: i18n.t('modal.error') })).toBeVisible()

		// Ensure the error message appears correctly
		await expect(
			modal.locator('p').filter({
				hasText: i18n.t('modal.failed_to_delete_post', { error: 'TypeError: Failed to fetch' }),
			}),
		).toBeVisible()

		// Close the error modal
		await modal.locator(`text=${i18n.t('modal.close')}`).click()
		await expect(modal.locator('h6').filter({ hasText: i18n.t('modal.error') })).not.toBeVisible()
	})
})

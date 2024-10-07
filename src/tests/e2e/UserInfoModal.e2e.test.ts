import { test, expect } from '@playwright/test'
import mockApiResponses from '#tests/e2e/mocks'
import i18n from '#src/i18n'
import mockUsers from '#tests/mocks/users.json' assert { type: 'json' }

test.describe('Modal', () => {
	// Before each test, mock the API responses and navigate to the main page
	test.beforeEach(async ({ page }) => {
		await mockApiResponses(page) // Use mocked API responses
		await page.goto('/')
	})

	// UserInfoModal Tests
	test('should display UserInfoModal with user information', async ({ page }) => {
		const mockUser = mockUsers[0]

		// Open UserInfoModal by clicking on the user name
		await page.locator(`text=${mockUser.name}`).click()

		await page.waitForSelector('[data-testid="user-info-modal-content"]', { state: 'visible' })

		const modal = page.locator('[data-testid="user-info-modal-content"]')

		// Verify the user's contact details
		await expect(modal.locator(`text=${i18n.t('user.contact')}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.email}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.phone}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.website}`)).toBeVisible()

		// Verify the user's address
		await expect(modal.locator(`text=${i18n.t('user.address')}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.address.street}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.address.city}`)).toBeVisible()

		// Close the modal
		await page.click(`text=${i18n.t('modal.close')}`)
		await expect(page.locator(`text=${i18n.t('user.contact')}`)).not.toBeVisible()
	})
})

import { test, expect } from '@playwright/test'
import mockApiResponses from '#tests/e2e/mocks'
import i18n from '#src/i18n'
import mockUsers from '#tests/mocks/users.json' assert { type: 'json' }

test.describe('AddPostModal E2E Tests', () => {
	// Before each test, mock the API responses and navigate to the main page
	test.beforeEach(async ({ page }) => {
		await mockApiResponses(page) // Mock API responses
		await page.goto('/')
	})

	test('should display AddPostModal and add a new post', async ({ page }) => {
		const mockUser = mockUsers[0] // Use the first mock user
		const newPostTitle = 'Test Post Title'
		const newPostBody = 'This is a test post body.'

		const userPane = page.locator(`[data-testid="user-pane-${mockUser.id}"]`)

		// Step 1: Open Add Post modal
		await userPane.locator(`text=${i18n.t('user.add_post')}`).click() // Open the Add Post modal

		// Step 2: Ensure the modal is open and the title matches the translation
		await expect(
			page.locator(`text=${i18n.t('modal.add_post_for', { userName: mockUser.name })}`),
		).toBeVisible()

		// Step 3: Fill in the title and body fields
		await page.fill('[name="title"]', newPostTitle)
		await page.fill('[name="body"]', newPostBody)

		// Step 4: Submit the form
		await page.click(`text=${i18n.t('modal.submit_post')}`)

		// Step 5: Verify the post was added (using the title)
		await expect(page.locator(`text=${newPostTitle}`)).toBeVisible()
	})

	test('should show validation error for missing title and body', async ({ page }) => {
		const mockUser = mockUsers[0]

		const userPane = page.locator(`[data-testid="user-pane-${mockUser.id}"]`)

		// Step 1: Open Add Post modal
		await userPane.locator(`text=${i18n.t('user.add_post')}`).click() // Open the Add Post modal

		// Step 2: Submit form without filling the fields to trigger validation errors
		await page.click(`text=${i18n.t('modal.submit_post')}`)

		// Step 3: Ensure validation error messages are displayed for both title and body
		await expect(
			page.locator(`text=${i18n.t('validation.required', { field: i18n.t('modal.title') })}`),
		).toBeVisible()
		await expect(
			page.locator(`text=${i18n.t('validation.required', { field: i18n.t('modal.body') })}`),
		).toBeVisible()
	})

	test('should show error message on failed post submission', async ({ page }) => {
		const mockUser = mockUsers[0]
		const newPostTitle = 'Test Post Title'
		const newPostBody = 'This is a test post body.'

		const userPane = page.locator(`[data-testid="user-pane-${mockUser.id}"]`)

		// Step 1: Open Add Post modal
		await userPane.locator(`text=${i18n.t('user.add_post')}`).click() // Open the Add Post modal

		// Step 2: Fill in the title and body fields
		await page.fill('[name="title"]', newPostTitle)
		await page.fill('[name="body"]', newPostBody)

		// Mock the API to simulate failure when submitting a new post
		await page.route('**/posts', (route) => route.abort())

		// Step 3: Submit the form (this should fail)
		await page.click(`text=${i18n.t('modal.submit_post')}`)

		// Step 4: Verify the error message is displayed
		await expect(
			page.locator(`text=${i18n.t('modal.failed_to_submit_post', { error: 'Failed to fetch' })}`),
		).toBeVisible()
	})

	test('should close AddPostModal without adding a post', async ({ page }) => {
		const mockUser = mockUsers[0]

		const userPane = page.locator(`[data-testid="user-pane-${mockUser.id}"]`)

		// Step 1: Open Add Post modal
		await userPane.locator(`text=${i18n.t('user.add_post')}`).click() // Open the Add Post modal

		// Step 2: Close the modal
		await page.locator(`text=${i18n.t('modal.close')}`).click()

		// Step 3: Ensure the modal is no longer visible
		await expect(
			page.locator(`text=${i18n.t('modal.add_post_for', { userName: mockUser.name })}`),
		).not.toBeVisible()
	})
})

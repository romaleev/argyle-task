import { test, expect } from '@playwright/test'
import mockApiResponses from '#tests/e2e/mocks'
import i18n from '#src/i18n'
import mockUsers from '#tests/mocks/users.json' assert { type: 'json' }
import mockPosts from '#tests/mocks/posts.json' assert { type: 'json' }

test.describe('PostPage End-to-End Tests', () => {
	// Before each test, mock the API responses and navigate to the main page
	test.beforeEach(async ({ page }) => {
		await mockApiResponses(page) // Use mocked API responses
		await page.goto('/')
	})

	test('should render users and posts', async ({ page }) => {
		const mockUser = mockUsers[0] // Get first user from the mock data
		const mockPost = mockPosts.find((post) => post.userId === mockUser.id)

		// Ensure the user's name is displayed
		await expect(page.locator(`text=${mockUser.name}`)).toBeVisible()

		// Expand the user's posts accordion
		await page.locator(`text=${mockUser.name}`).click()

		// Check if the user's post is displayed
		if (mockPost) {
			await expect(page.locator(`text=${mockPost.title}`)).toBeVisible()
		}
	})

	test('should handle "No posts available" for a user with no posts', async ({ page }) => {
		const mockUser = {
			...mockUsers[0],
			id: 9999,
			name: 'Test user',
		} // Assuming user 2 has no posts in the mock data

		await page.route('**/users', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify([mockUser, ...mockUsers]),
			}),
		)

		// Ensure the user's name is displayed
		await expect(page.locator(`text=${mockUser.name}`)).toBeVisible()

		// Expand the accordion for this user
		await page.locator(`text=${mockUser.name}`).click()

		// Check that "No posts available" message is visible
		await expect(page.locator(`text=${i18n.t('user.no_posts_available')}`)).toBeVisible()
	})

	test('should allow adding a new post for a user', async ({ page }) => {
		const newPostTitle = 'New Test Post Title'
		const newPostBody = 'This is the body of the new post.'

		const userPane = page.locator(`[data-testid="user-pane-${mockUsers[0].id}"]`)

		// Step 1: Open Add Post modal
		await userPane.locator(`text=${i18n.t('user.add_post')}`).click() // Open the Add Post modal

		// Fill out the form in the modal
		await page.fill('[name="title"]', newPostTitle)
		await page.fill('[name="body"]', newPostBody)

		// Submit the form
		await page.click(`text=${i18n.t('modal.submit_post')}`)

		// Verify that the new post is displayed in the user's post list
		await expect(page.locator(`text=${newPostTitle}`)).toBeVisible()
	})

	test('should allow deleting a post', async ({ page }) => {
		const mockUser = mockUsers[0]
		const mockPost = mockPosts.find((post) => post.userId === mockUser.id) || mockPosts[0]

		const userPane = page.locator(`[data-testid="user-pane-${mockUser.id}"]`)
		const userPost = userPane.locator(`[data-testid="user-post-${mockUser.id}-${mockPost.id}"]`)

		// Ensure the post is present before deletion
		await expect(userPost.locator(`text=${mockPost?.title}`)).toBeVisible()

		// Click the "Delete" button for the post
		await userPost.locator(`button:has-text("${i18n.t('user.delete')}")`).click()

		// Ensure the post is no longer visible after deletion
		await expect(userPane.locator(`text=${mockPost?.title}`)).not.toBeVisible()
	})

	test('should display PostInfoModal when clicking on a post title', async ({ page }) => {
		const mockUser = mockUsers[0]
		const mockPost = mockPosts.find((post) => post.userId === mockUser.id)

		// Click on the post title to open the PostInfoModal
		await page.locator(`text=${mockPost?.title}`).click()

		const modal = page.locator('[data-testid="modal-content"]')

		// Ensure the modal displays the post title and body
		await expect(modal.locator(`text=${mockPost?.title}`)).toBeVisible()
		await expect(modal.locator(`text=${mockPost?.body}`)).toBeVisible()
	})

	test('should display UserInfoModal when clicking on user name', async ({ page }) => {
		const mockUser = mockUsers[0]

		// Click on the user name to open the UserInfoModal
		await page.locator(`text=${mockUser.name}`).click()

		const modal = page.locator('[data-testid="modal-content"]')

		// Ensure the modal displays the user's information
		await expect(modal.locator(`text=${i18n.t('user.contact')}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.email}`)).toBeVisible()
		await expect(modal.locator(`text=${mockUser.phone}`)).toBeVisible()
	})
})

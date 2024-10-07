import { test, expect } from '@playwright/test'
import mockApiResponses from '#tests/e2e/mocks'
import i18n from '#src/i18n'
import mockUsers from '#tests/mocks/users.json'
import mockPosts from '#tests/mocks/posts.json'
import mockComments from '#tests/mocks/comments.json'

test.describe('PostinfoModal', () => {
	// Before each test, mock the API responses and navigate to the main page
	test.beforeEach(async ({ page }) => {
		await mockApiResponses(page) // Use mocked API responses
		await page.goto('/')
	})

	// PostInfoModal Tests
	test('should display PostInfoModal with post and comments', async ({ page }) => {
		const mockUser = mockUsers[0]
		const mockPost = mockPosts.find((post) => post.userId === mockUser.id)
		const postComments = mockComments.filter((comment) => comment.postId === mockPost?.id)

		// Open PostInfoModal by clicking on a post title
		await page.locator(`text=${mockPost?.title}`).click()

		await page.waitForSelector('[data-testid="post-info-modal-content"]', { state: 'visible' })

		const modal = page.locator('[data-testid="post-info-modal-content"]')

		// Ensure the modal shows the post details and comments section
		await expect(modal.locator(`text=${mockUser.name}`)).toBeVisible()
		await expect(modal.locator(`text=${mockPost?.title}`)).toBeVisible()
		await expect(modal.locator(`text=${mockPost?.body}`)).toBeVisible()
		await expect(modal.locator(`text=${i18n.t('user.comments')}`)).toBeVisible()

		// Verify that the comments are displayed correctly
		for (const comment of postComments) {
			await expect(modal.locator(`text=${comment.body}`)).toBeVisible() // Dynamically check each comment body
		}
	})
})

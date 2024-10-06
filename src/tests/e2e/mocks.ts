import { Page } from '@playwright/test'
import mockUsers from '#src/tests/mocks/users.json'
import mockPosts from '#src/tests/mocks/posts.json'
import mockComments from '#src/tests/mocks/comments.json'
import { urls } from '#src/config'

export default async (page: Page) => {
	// Mock users API response
	await page.route(urls.users, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockUsers),
		}),
	)

	// Mock posts API response
	await page.route(urls.posts, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockPosts),
		}),
	)

	// Mock comments API response
	await page.route(urls.comments, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockComments),
		}),
	)
}

import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import UserPane from '#components/user/UserPane'
import { AppState, Post } from '#types/appTypes'
import mockUsers from '#tests/mocks/users.json'
import mockPosts from '#tests/mocks/posts.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'
import { useAppStore } from '#src/stores/appStore'

const mockUser = mockUsers[0]
const initialState: AppState = {
	users: [mockUser],
	posts: mockPosts,
	comments: [],
}

const setup = (state = initialState) => {
	useAppStore.setState(state)

	render(
		<I18nextProvider i18n={i18n}>
			<UserPane userId={mockUser.id} expanded={true} />
		</I18nextProvider>,
	)
}

describe('UserPane', () => {
	test('renders username and post count with translation', () => {
		setup()

		// Check if the user's name is rendered correctly
		expect(screen.getByText(mockUser.name)).toBeInTheDocument()

		// Check if the post count is translated correctly
		const postCount = mockPosts.filter((post: Post) => post.userId === mockUser.id).length
		expect(screen.getByText(`${i18n.t('user.posts', { count: postCount })}`)).toBeInTheDocument()
	})

	test('calls userInfo modal when user name is clicked', async () => {
		setup()

		// Click the user name (which should trigger onUserInfo)
		await act(async () => {
			fireEvent.click(screen.getByText(mockUser.name))
		})

		await waitFor(() => {
			expect(useAppStore.getState().modals?.userInfo).toBeDefined()
		})
	})

	test('calls addPost modal when Add Post button is clicked', async () => {
		setup()

		// Click the Add Post button
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('user.add_post')))
		})

		await waitFor(() => {
			expect(useAppStore.getState().modals?.addPost).toBeDefined()
		})
	})

	test('renders "No posts available" message when user has no posts', () => {
		const emptyState: AppState = {
			users: [mockUser],
			posts: [], // No posts for the user
			comments: [],
		}

		setup(emptyState)

		// Check if the "No posts available" message is translated and rendered
		expect(screen.getByText(i18n.t('user.no_posts_available'))).toBeInTheDocument()
	})

	test('renders multiple posts correctly', () => {
		setup()

		// Ensure that each post is rendered correctly
		mockPosts
			.filter((post: Post) => post.userId === mockUser.id)
			.forEach((post) => {
				expect(screen.getByText(post.title)).toBeInTheDocument()
				expect(screen.getByTestId(`user-post-${post.userId}-${post.id}`)).toBeInTheDocument()
			})
	})
})

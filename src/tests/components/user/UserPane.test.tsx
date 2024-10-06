import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import UserPane from '#components/user/UserPane'
import { StateProvider } from '#providers/StateProvider'
import { AppState, Post } from '#types/appTypes'
import mockUsers from '#tests/mocks/users.json'
import mockPosts from '#tests/mocks/posts.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

const mockUser = mockUsers[0]
const initialState: AppState = {
	users: [mockUser],
	posts: mockPosts,
	comments: [],
}

let handlePostInfo: jest.Mock
let handleUserInfo: jest.Mock
let handleAddPost: jest.Mock
let handleDeletePost: jest.Mock

const setup = (state = initialState) => {
	handlePostInfo = jest.fn()
	handleUserInfo = jest.fn()
	handleAddPost = jest.fn()
	handleDeletePost = jest.fn()

	render(
		<I18nextProvider i18n={i18n}>
			<StateProvider initialState={state}>
				<UserPane
					userId={mockUser.id}
					onPostInfo={handlePostInfo}
					onUserInfo={handleUserInfo}
					onAddPost={handleAddPost}
					onDeletePost={handleDeletePost}
					expanded={true}
				/>
			</StateProvider>
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

	test('calls onUserInfo when user name is clicked', async () => {
		setup()

		// Click the user name (which should trigger onUserInfo)
		await act(async () => {
			fireEvent.click(screen.getByText(mockUser.name))
		})

		// Check if the onUserInfo handler was called with the correct userId
		expect(handleUserInfo).toHaveBeenCalledTimes(1)
		expect(handleUserInfo).toHaveBeenCalledWith(mockUser.id)
	})

	test('calls onAddPost when Add Post button is clicked', async () => {
		setup()

		// Click the Add Post button
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('user.add_post')))
		})

		// Check if the onAddPost handler was called with the correct userId
		expect(handleAddPost).toHaveBeenCalledTimes(1)
		expect(handleAddPost).toHaveBeenCalledWith(mockUser.id)
	})

	test('calls onPostInfo when a post is clicked', async () => {
		setup()

		// Simulate clicking the first post's title
		await act(async () => {
			fireEvent.click(screen.getByTestId(`post-title-${mockPosts[0].id}`))
		})

		// Check if the onPostInfo handler was called with the correct postId
		expect(handlePostInfo).toHaveBeenCalledTimes(1)
		expect(handlePostInfo).toHaveBeenCalledWith(mockPosts[0].id)
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
				expect(screen.getByTestId(`post-title-${post.id}`)).toBeInTheDocument()
			})
	})

	test.only('calls onDeletePost when the Delete button is clicked', async () => {
		setup()

		// Update the test to find the DELETE button with the correct test ID
		const deleteButton = screen.getByTestId(`delete-button-${mockPosts[0].id}`)

		// Click the delete button
		await act(async () => {
			fireEvent.click(deleteButton)
		})

		// Ensure the delete handler is called with the correct post ID
		expect(handleDeletePost).toHaveBeenCalledTimes(1)
		expect(handleDeletePost).toHaveBeenCalledWith(mockPosts[0].id)
	})
})

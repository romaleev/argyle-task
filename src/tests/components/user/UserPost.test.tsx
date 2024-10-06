import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import UserPost from '#components/user/UserPost'
import { StateProvider } from '#providers/StateProvider'
import { AppState } from '#types/appTypes'
import mockComments from '#tests/mocks/comments.json'
import mockPosts from '#tests/mocks/posts.json'
import mockUsers from '#tests/mocks/users.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

const mockUser = mockUsers[0]
const mockPost = mockPosts[0]
const initialState: AppState = {
	users: [mockUser],
	posts: mockPosts,
	comments: mockComments,
}

let handleDelete: jest.Mock
let handlePostInfo: jest.Mock

const setup = (state = initialState) => {
	handleDelete = jest.fn()
	handlePostInfo = jest.fn()

	render(
		<I18nextProvider i18n={i18n}>
			<StateProvider initialState={state}>
				<UserPost post={mockPost} onDelete={handleDelete} onPostInfo={handlePostInfo} />
			</StateProvider>
		</I18nextProvider>,
	)
}

describe('UserPost', () => {
	test('renders post title and body correctly', () => {
		setup()

		// Check if the post title is rendered
		expect(screen.getByText(mockPost.title)).toBeInTheDocument()

		// Check if the post body is rendered
		const postBody = new RegExp(mockPost.body.replace(/\s+/g, ' ').trim())
		expect(screen.getByText(postBody)).toBeInTheDocument()
	})

	test('renders correct number of comments', () => {
		setup()

		// Check if the correct number of comments is displayed in the link
		const commentCount = mockComments.filter((comment) => comment.postId === mockPost.id).length
		expect(
			screen.getByText(`${commentCount} ${i18n.t('user.comments', { count: commentCount })}`),
		).toBeInTheDocument()
	})

	test('calls onDelete when Delete button is clicked', async () => {
		setup()

		// Simulate clicking the Delete button
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('user.delete')))
		})

		// Check if the onDelete handler was called with the correct postId
		expect(handleDelete).toHaveBeenCalledTimes(1)
		expect(handleDelete).toHaveBeenCalledWith(mockPost.id)
	})

	test('calls onPostInfo when comment link is clicked', async () => {
		setup()

		// Simulate clicking on the comments link
		await act(async () => {
			fireEvent.click(screen.getByText(/Comments/i))
		})

		// Check if the onPostInfo handler was called with the correct postId
		expect(handlePostInfo).toHaveBeenCalledTimes(1)
		expect(handlePostInfo).toHaveBeenCalledWith(mockPost.id)
	})

	test('displays loading state when delete is in progress', async () => {
		setup()

		// Simulate clicking the delete button and having it in loading state
		handleDelete.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

		// Trigger the delete action
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('user.delete')))
		})

		// Check if loading spinner is shown (progressbar)
		expect(screen.getByRole('progressbar')).toBeInTheDocument()

		// Wait for async action to finish
		await act(async () => new Promise((resolve) => setTimeout(resolve, 100)))

		// Ensure loading spinner is removed after completion
		expect(screen.queryByRole('progressbar')).toBeNull()
	})
})

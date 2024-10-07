import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import UserPost from '#components/user/UserPost'
import { AppState } from '#types/appTypes'
import mockComments from '#tests/mocks/comments.json'
import mockPosts from '#tests/mocks/posts.json'
import mockUsers from '#tests/mocks/users.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'
import { useAppStore } from '#src/stores/appStore'

const mockUser = mockUsers[0]
const mockPost = mockPosts[0]
const initialState: AppState = {
	users: [mockUser],
	posts: mockPosts,
	comments: mockComments,
}

const setup = (state = initialState) => {
	useAppStore.setState(state)

	render(
		<I18nextProvider i18n={i18n}>
			<UserPost post={mockPost} />
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

	test('deletes post when the Delete button is clicked', async () => {
		setup()

		const post = useAppStore
			.getState()
			.posts.find((post) => post.id === mockPosts[0].id && post.userId === mockUser.id)
		expect(post).toBeDefined()

		// Update the test to find the DELETE button with the correct test ID
		const deleteButton = screen.getByTestId(`delete-button-${mockPosts[0].id}`)

		// Click the delete button
		await act(async () => {
			fireEvent.click(deleteButton)
		})

		await waitFor(
			() => {
				const deletedPost = useAppStore
					.getState()
					.posts.find((post) => post.id === mockPosts[0].id && post.userId === mockUser.id)
				expect(deletedPost).toBeUndefined()
			},
			{ timeout: 3000 },
		)
	})

	test('calls postInfo modal when a post is clicked', async () => {
		setup()
		// Simulate clicking the first post's title
		await act(async () => {
			fireEvent.click(screen.getByTestId(`user-post-${mockPosts[0].userId}-${mockPosts[0].id}`))
		})

		await waitFor(() => {
			expect(useAppStore.getState().modals?.postInfo).toBeDefined()
		})
	})

	test('displays loading state when delete is in progress', async () => {
		setup()

		// Trigger the delete action
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('user.delete')))
		})

		await waitFor(() => {
			// Check if loading spinner is shown (progressbar)
			expect(screen.getByRole('progressbar')).toBeInTheDocument()
		})

		await waitFor(
			() => {
				// Ensure loading spinner is removed after completion
				expect(screen.queryByRole('progressbar')).toBeNull()
			},
			{ timeout: 3000 },
		)
	})
})

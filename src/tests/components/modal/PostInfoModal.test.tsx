import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PostInfoModal from '#components/modal/PostInfoModal'
import { StateProvider } from '#providers/StateProvider'
import { AppState } from '#types/appTypes'
import mockPosts from '#tests/mocks/posts.json'
import mockUsers from '#tests/mocks/users.json'
import mockComments from '#tests/mocks/comments.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

const mockPost = mockPosts[0]
const mockUser = mockUsers[0]
let handleClose: jest.Mock

const initialState: AppState = {
	posts: [mockPost],
	comments: [mockComments[0]],
	users: [mockUser],
}

// A utility function to render the PostInfoModal in different scenarios
const setup = (userId: number, postId: number, state = initialState) => {
	handleClose = jest.fn()
	render(
		<I18nextProvider i18n={i18n}>
			<StateProvider initialState={state}>
				<PostInfoModal userId={userId} postId={postId} onClose={handleClose} />
			</StateProvider>
		</I18nextProvider>,
	)
}

describe('PostInfoModal', () => {
	test('renders post information correctly', () => {
		// Render the modal for the existing post
		setup(mockUser.id, mockPost.id)

		// Check if the post's title and body are displayed
		expect(screen.getByText(mockPost.title)).toBeInTheDocument()
		const postBody = new RegExp(mockPost.body.replace(/\s+/g, ' ').trim())
		expect(screen.getByText(postBody)).toBeInTheDocument()
	})

	test('renders comments correctly when present', () => {
		// Render the modal with comments
		setup(mockUser.id, mockPost.id)

		// Check if the comments section is rendered with the translated text
		expect(screen.getByText(i18n.t('user.comments') + ':')).toBeInTheDocument()

		// Check if the comment body is displayed
		const commentBody = new RegExp(mockComments[0].body.replace(/\s+/g, ' ').trim())
		expect(screen.getByText(commentBody)).toBeInTheDocument()
	})

	test('shows no comments message if no comments are available', () => {
		// Render the modal without comments
		const emptyState: AppState = {
			...initialState,
			comments: [], // Set comments to an empty array
		}

		setup(mockUser.id, mockPost.id, emptyState)

		// Check if the "No comments" message is displayed
		expect(screen.getByText(i18n.t('user.no_comments_yet'))).toBeInTheDocument()
	})

	test('calls onClose when the close button is clicked', () => {
		// Render the modal for the existing post
		setup(mockUser.id, mockPost.id)

		// Click the close button
		fireEvent.click(screen.getByText(i18n.t('modal.close')))

		// Ensure the onClose callback is called
		expect(handleClose).toHaveBeenCalled()
	})

	test('does not render if post is not found', () => {
		// Render the modal with an invalid postId
		setup(mockUser.id, 9999)

		// Ensure the modal doesn't render anything
		expect(screen.queryByText(i18n.t('user.comments'))).toBeNull()
		expect(screen.queryByText(mockPost.title)).toBeNull()
	})
})

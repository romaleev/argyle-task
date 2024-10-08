import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import AddPostModal from '#components/modal/AddPostModal'
import { AppState } from '#types/appTypes'
import mockUsers from '#tests/mocks/users.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'
import { useAppStore } from '#src/stores/appStore'

const mockUser = mockUsers[0]
const initialState: AppState = {
	users: [mockUser],
	posts: [],
	comments: [],
}

const setupModal = (userId = 9999) => {
	jest.spyOn(console, 'error').mockImplementation() // Suppress console errors

	useAppStore.setState({
		modals: { addPost: { userId } },
		...initialState,
	})

	// Render the AddPostModal inside beforeEach
	render(
		<I18nextProvider i18n={i18n}>
			<AddPostModal />
		</I18nextProvider>,
	)
}

describe('AddPostModal', () => {
	test('renders form fields correctly', () => {
		setupModal(mockUser.id)

		// Check if title and body inputs are rendered
		expect(screen.getByLabelText(i18n.t('modal.title'))).toBeInTheDocument()
		expect(screen.getByLabelText(i18n.t('modal.body'))).toBeInTheDocument()

		// Check if the submit button is rendered
		expect(screen.getByText(i18n.t('modal.submit_post'))).toBeInTheDocument()
	})

	test('displays validation errors on empty inputs', async () => {
		setupModal(mockUser.id)

		// Try to submit the form without any input
		await act(async () => {
			fireEvent.click(screen.getByText(i18n.t('modal.submit_post')))
		})

		// Check for validation errors for both title and body fields
		const titleError = i18n.t('validation.required', { field: i18n.t('modal.title') })
		const bodyError = i18n.t('validation.required', { field: i18n.t('modal.body') })

		expect(await screen.findByText(titleError)).toBeInTheDocument()
		expect(await screen.findByText(bodyError)).toBeInTheDocument()
	})

	test('submits the form successfully when inputs are valid', async () => {
		setupModal(mockUser.id)

		// Enter valid form data
		const testTitle = 'Test Post Title'
		const testBody = 'This is a test post body'

		await act(async () => {
			fireEvent.change(screen.getByLabelText(i18n.t('modal.title')), {
				target: { value: testTitle },
			})
			fireEvent.change(screen.getByLabelText(i18n.t('modal.body')), { target: { value: testBody } })

			// Submit the form
			fireEvent.click(screen.getByText(i18n.t('modal.submit_post')))
		})

		await waitFor(
			() => {
				const newPost = useAppStore
					.getState()
					.posts.find(
						(post) =>
							post.title === testTitle && post.body === testBody && post.userId === mockUser.id,
					)

				expect(newPost).toBeDefined()

				// Ensure modal closes after successful submission
				expect(useAppStore.getState()?.modals?.addPost).toBeUndefined()
			},
			{ timeout: 3000 },
		)
	})

	test('shows loading state during form submission', async () => {
		setupModal(mockUser.id)

		// Enter valid form data
		await act(async () => {
			fireEvent.change(screen.getByLabelText(i18n.t('modal.title')), {
				target: { value: 'Valid title' },
			})
			fireEvent.change(screen.getByLabelText(i18n.t('modal.body')), {
				target: { value: 'Valid body' },
			})
			fireEvent.click(screen.getByText(i18n.t('modal.submit_post')))
		})

		await waitFor(() => {
			// Verify that the loading indicator is shown
			expect(screen.queryByRole('progressbar')).toBeInTheDocument()
		})

		await waitFor(
			() => {
				// Ensure the loading indicator is gone
				expect(screen.queryByRole('progressbar')).toBeNull()
			},
			{ timeout: 3000 },
		)
	})

	test('does not render if user is not found', () => {
		setupModal()

		// Ensure the modal doesn't render anything
		expect(screen.queryByText(i18n.t('modal.submit_post'))).toBeNull()
	})
})

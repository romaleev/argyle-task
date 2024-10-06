import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import AddPostModal from '#components/modal/AddPostModal'
import { StateProvider } from '#providers/StateProvider'
import { AppState } from '#types/appTypes'
import mockUsers from '#tests/mocks/users.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUser = mockUsers[0]
const initialState: AppState = {
	users: [mockUser],
	posts: [],
	comments: [],
}

let handleAddPost: jest.Mock
let handleClose: jest.Mock

const setupModal = (userId = 9999) => {
	jest.spyOn(console, 'error').mockImplementation() // Suppress console errors

	handleAddPost = jest.fn()
	handleClose = jest.fn()

	// Render the AddPostModal inside beforeEach
	render(
		<I18nextProvider i18n={i18n}>
			<StateProvider initialState={initialState}>
				<AddPostModal userId={userId} onAddPost={handleAddPost} onClose={handleClose} />
			</StateProvider>
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

		// Wait for the async function to resolve
		await waitFor(() => expect(handleAddPost).toHaveBeenCalled())

		// Check that the form submitted with correct data
		expect(handleAddPost).toHaveBeenCalledWith({
			title: testTitle,
			body: testBody,
			userId: mockUser.id,
		})

		// Ensure modal closes after successful submission
		expect(handleClose).toHaveBeenCalled()
	})

	test('displays error message if form submission fails', async () => {
		setupModal(mockUser.id)

		handleAddPost.mockRejectedValue(new Error('Submit failed'))

		// Enter valid form data
		await act(async () => {
			fireEvent.change(screen.getByLabelText(i18n.t('modal.title')), {
				target: { value: 'Valid title' },
			})
			fireEvent.change(screen.getByLabelText(i18n.t('modal.body')), {
				target: { value: 'Valid body' },
			})

			// Submit the form
			fireEvent.click(screen.getByText(i18n.t('modal.submit_post')))
		})

		// Check for the error message
		expect(
			await screen.findByText((content, element) => content.includes('Submit failed')),
		).toBeInTheDocument()
	})

	test('shows loading state during form submission', async () => {
		setupModal(mockUser.id)

		handleAddPost.mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 100)), // Simulate async delay
		)

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

		// Verify that the loading indicator is shown
		expect(screen.queryByRole('progressbar')).toBeInTheDocument()

		// Wait for the async function to resolve
		await waitFor(() => expect(handleAddPost).toHaveBeenCalled())

		// Ensure the loading indicator is gone
		await sleep(500)
		expect(screen.queryByRole('progressbar')).toBeNull()
	})

	test('does not render if user is not found', () => {
		setupModal()

		// Ensure the modal doesn't render anything
		expect(screen.queryByText(i18n.t('modal.submit_post'))).toBeNull()
	})
})

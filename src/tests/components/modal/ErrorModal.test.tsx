import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorModal from '#components/modal/ErrorModal'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

let handleClose: jest.Mock

const setupModal = (errorMessage = '') => {
	handleClose = jest.fn()

	// Render ErrorModal before each test
	render(
		<I18nextProvider i18n={i18n}>
			<ErrorModal errorMessage={errorMessage} onClose={handleClose} />
		</I18nextProvider>,
	)
}

describe('ErrorModal', () => {
	test('renders the error message', () => {
		setupModal('Test error message')

		// Check if the error message is displayed
		expect(screen.getByText('Test error message')).toBeInTheDocument()
	})

	test('renders translated error title', () => {
		setupModal('Test error message')

		// Check if the translated error title is displayed
		expect(screen.getByText(i18n.t('modal.error'))).toBeInTheDocument()
	})

	test('calls onClose when the close button is clicked', () => {
		setupModal('Test error message')

		// Click the close button
		fireEvent.click(screen.getByText(i18n.t('modal.close')))

		// Ensure the onClose callback is called
		expect(handleClose).toHaveBeenCalled()
	})

	test('does not render if message is not provided', () => {
		setupModal()

		// Ensure the modal does not render anything when there's no message
		expect(screen.queryByText(i18n.t('modal.error'))).toBeNull()
	})
})

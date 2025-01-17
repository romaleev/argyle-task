import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import UserInfoModal from '#components/modal/UserInfoModal'
import mockUsers from '#tests/mocks/users.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'
import { useAppStore } from '#src/stores/appStore'

const mockUser = mockUsers[0]

const setupModal = (userId = 9999) => {
	useAppStore.setState({
		modals: { userInfo: { userId } },
		users: [mockUser],
		posts: [],
		comments: [],
	})

	// Render the UserInfoModal before each test except for the invalid user test
	render(
		<I18nextProvider i18n={i18n}>
			<UserInfoModal />
		</I18nextProvider>,
	)
}

describe('UserInfoModal', () => {
	test('renders user information correctly', () => {
		setupModal(mockUser.id)

		// Check if the user's name is displayed
		expect(screen.getByText(mockUser.name)).toBeInTheDocument()

		// Check if the contact section is rendered
		expect(screen.getByText(i18n.t('user.contact'))).toBeInTheDocument()

		// Check for clickable email and phone
		expect(screen.getByText(mockUser.email)).toHaveAttribute('href', `mailto:${mockUser.email}`)
		expect(screen.getByText(mockUser.phone)).toHaveAttribute('href', `tel:${mockUser.phone}`)

		// Check for website link
		expect(screen.getByText(mockUser.website)).toHaveAttribute(
			'href',
			`https://${mockUser.website}`,
		)

		// Check if the address section is rendered, using i18n labels
		expect(
			screen.getByText(`${i18n.t('user.street')}: ${mockUser.address.street}`),
		).toBeInTheDocument()
		expect(
			screen.getByText(`${i18n.t('user.suite')}: ${mockUser.address.suite}`),
		).toBeInTheDocument()
		expect(screen.getByText(`${i18n.t('user.city')}: ${mockUser.address.city}`)).toBeInTheDocument()
		expect(
			screen.getByText(`${i18n.t('user.zipcode')}: ${mockUser.address.zipcode}`),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				`${i18n.t('user.geo')}: ${mockUser.address.geo.lat}, ${mockUser.address.geo.lng}`,
			),
		).toBeInTheDocument()

		// Check if the company section is rendered, using i18n labels
		expect(screen.getByText(i18n.t('user.company'))).toBeInTheDocument()
		expect(
			screen.getByText(`${i18n.t('user.company_name')}: ${mockUser.company.name}`),
		).toBeInTheDocument()
		expect(
			screen.getByText(`${i18n.t('user.catchphrase')}: ${mockUser.company.catchPhrase}`),
		).toBeInTheDocument()
		expect(screen.getByText(`${i18n.t('user.bs')}: ${mockUser.company.bs}`)).toBeInTheDocument()
	})

	test('calls onClose when close button is clicked', () => {
		setupModal(mockUser.id)

		// Click the close button
		fireEvent.click(screen.getByText(i18n.t('modal.close')))

		expect(useAppStore.getState()?.modals?.userInfo).toBeUndefined()
	})

	test('does not render if user is not found', () => {
		setupModal()

		// Ensure the modal doesn't render anything
		expect(screen.queryByText(i18n.t('user.contact'))).toBeNull()
	})
})

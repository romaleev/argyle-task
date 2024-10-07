import React from 'react'
import { Typography, Divider, Link, Box, Button } from '@mui/material'
import { AppModalProps } from '#types/appTypes'
import AppModal from '#components/modal/AppModal'
import { useTranslation } from 'react-i18next'
import { useActions, useModals, useUsers } from '#src/stores/appStore'

const UserInfoModal: React.FC<AppModalProps> = () => {
	const { t } = useTranslation()
	const modals = useModals()
	const users = useUsers()
	const actions = useActions()

	if (!modals?.userInfo) return null
	const userId = modals.userInfo.userId
	const onClose = () => {
		actions.setModals({ userInfo: undefined })
	}

	const user = users.find((u) => u.id === userId)
	if (!user) return null

	return (
		<AppModal onClose={onClose}>
			<Box data-testid='user-info-modal-content'>
				{/* Centered and Bold User's Name */}
				<Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
					{user.name}
				</Typography>

				{/* Contact Information */}
				<Typography variant='h6' gutterBottom>
					{t('user.contact')}
				</Typography>

				{/* Clickable Email and Phone */}
				<Typography variant='body1'>
					{t('user.email')}:
					<Link href={`mailto:${user.email}`} sx={{ ml: 1 }}>
						{user.email}
					</Link>
				</Typography>
				<Typography variant='body1'>
					{t('user.phone')}:
					<Link href={`tel:${user.phone}`} sx={{ ml: 1 }}>
						{user.phone}
					</Link>
				</Typography>

				{/* Website Link */}
				<Typography variant='body1'>
					{t('user.website')}:
					<Link
						href={`https://${user.website}`}
						target='_blank'
						rel='noopener noreferrer'
						sx={{ ml: 1 }}
					>
						{user.website}
					</Link>
				</Typography>

				<Divider sx={{ my: 2 }} />

				{/* User's Address */}
				<Typography variant='h6' gutterBottom>
					{t('user.address')}
				</Typography>
				<Typography variant='body2'>
					{t('user.street')}: {user.address.street}
				</Typography>
				<Typography variant='body2'>
					{t('user.suite')}: {user.address.suite}
				</Typography>
				<Typography variant='body2'>
					{t('user.city')}: {user.address.city}
				</Typography>
				<Typography variant='body2'>
					{t('user.zipcode')}: {user.address.zipcode}
				</Typography>
				<Typography variant='body2'>
					{t('user.geo')}: {user.address.geo.lat}, {user.address.geo.lng}
				</Typography>

				<Divider sx={{ my: 2 }} />

				{/* User's Company */}
				<Typography variant='h6' gutterBottom>
					{t('user.company')}
				</Typography>
				<Typography variant='body2'>
					{t('user.company_name')}: {user.company.name}
				</Typography>
				<Typography variant='body2'>
					{t('user.catchphrase')}: {user.company.catchPhrase}
				</Typography>
				<Typography variant='body2'>
					{t('user.bs')}: {user.company.bs}
				</Typography>

				<Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
					<Button variant='outlined' color='primary' onClick={onClose}>
						{t('modal.close')}
					</Button>
				</Box>
			</Box>
		</AppModal>
	)
}

export default UserInfoModal

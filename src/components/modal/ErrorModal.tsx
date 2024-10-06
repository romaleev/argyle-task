import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AppModal from '#components/modal/AppModal'
import { ErrorModalProps } from '#types/appTypes'
import { useTranslation } from 'react-i18next'

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
	const { t } = useTranslation()

	if (!errorMessage) return null

	return (
		<AppModal onClose={onClose}>
			<Typography variant='h6' color='error' gutterBottom>
				{t('modal.error')}
			</Typography>
			<Typography variant='body1' gutterBottom>
				{errorMessage}
			</Typography>
			<Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
				<Button variant='outlined' color='primary' onClick={onClose}>
					{t('modal.close')}
				</Button>
			</Box>
		</AppModal>
	)
}

export default ErrorModal

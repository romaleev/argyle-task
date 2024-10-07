import React from 'react'
import { Typography, Button, Box } from '@mui/material'
import AppModal from '#components/modal/AppModal'
import { useTranslation } from 'react-i18next'
import { useActions, useModals } from '#src/stores/appStore'
import { AppModalProps } from '#types/appTypes'

const ErrorModal: React.FC<AppModalProps> = () => {
	const { t } = useTranslation()
	const modals = useModals()
	const actions = useActions()

	if (!modals?.errorInfo) return null
	const { errorMessage } = modals.errorInfo
	const onClose = () => {
		actions.setModals({ errorInfo: undefined })
	}
	if (!errorMessage) return null

	return (
		<AppModal onClose={onClose}>
			<Box data-testid='error-modal-content'>
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
			</Box>
		</AppModal>
	)
}

export default ErrorModal

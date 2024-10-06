import React from 'react'
import { Modal, Box } from '@mui/material'
import { AppModalProps } from '#types/appTypes'

const AppModal: React.FC<AppModalProps> = ({ onClose, children, width = '600px' }) => {
	return (
		<Modal open={true} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '90%', sm: width }, // Responsive width
					maxWidth: '100%', // Prevent exceeding screen width
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
				data-testid='modal-content'
			>
				{children}
			</Box>
		</Modal>
	)
}

export default AppModal

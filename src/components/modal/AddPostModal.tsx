import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, CircularProgress, Typography, Box } from '@mui/material'
import { AppModalProps, PostFormInputs } from '#types/appTypes'
import AppModal from '#components/modal/AppModal'
import { useTranslation } from 'react-i18next'
import { useActions, useModals, useUsers } from '#src/stores/appStore'

const AddPostModal: React.FC<AppModalProps> = () => {
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PostFormInputs>()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const users = useUsers()
	const modals = useModals()
	const actions = useActions()

	if (!modals?.addPost) return null
	const userId = modals.addPost.userId
	const onClose = () => {
		actions.setModals({ addPost: undefined })
	}

	const user = users.find((user) => user.id === userId)
	if (!user) return null

	const userName = user ? user.name : t('user.user_not_found')

	const onSubmit = async (data: PostFormInputs) => {
		setLoading(true)
		setError(null)

		try {
			await actions.addPost({ title: data.title, body: data.body, userId })
			reset()
			onClose?.()
		} catch (error) {
			console.error(error)
			setError(
				t('modal.failed_to_submit_post', {
					error: error instanceof Error ? error.message : String(error),
				}),
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<AppModal onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)} data-testid='add-post-modal-content'>
				<Typography variant='h6' gutterBottom>
					{t('modal.add_post_for', { userName })}
				</Typography>

				<TextField
					label={t('modal.title')}
					{...register('title', {
						required: t('validation.required', { field: t('modal.title') }),
						minLength: {
							value: 4,
							message: t('validation.min_length', { field: t('modal.title'), min: 4 }),
						},
						maxLength: {
							value: 80,
							message: t('validation.max_length', { field: t('modal.title'), max: 80 }),
						},
					})}
					error={!!errors.title}
					helperText={errors.title ? errors.title.message : ''}
					fullWidth
					margin='normal'
					autoFocus
				/>

				<TextField
					label={t('modal.body')}
					{...register('body', {
						required: t('validation.required', { field: t('modal.body') }),
						minLength: {
							value: 10,
							message: t('validation.min_length', { field: t('modal.body'), min: 10 }),
						},
						maxLength: {
							value: 640,
							message: t('validation.max_length', { field: t('modal.body'), max: 640 }),
						},
					})}
					error={!!errors.body}
					helperText={errors.body ? errors.body.message : ''}
					multiline
					rows={6}
					fullWidth
					margin='normal'
				/>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
					<Button variant='outlined' onClick={onClose} tabIndex={1}>
						{t('modal.close')}
					</Button>

					<Button
						variant='contained'
						type='submit'
						disabled={loading}
						sx={{ display: 'flex', alignItems: 'center', minWidth: '10em' }}
						tabIndex={0}
					>
						{loading ? (
							<CircularProgress
								role='progressbar'
								size={24}
								sx={{ color: 'white', marginRight: '8px' }}
							/>
						) : (
							t('modal.submit_post')
						)}
					</Button>
				</Box>

				{error && (
					<Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
						{error}
					</Typography>
				)}
			</form>
		</AppModal>
	)
}

export default AddPostModal

import React from 'react'
import { Typography, Box, Button } from '@mui/material'
import AppModal from '#components/modal/AppModal'
import { useApp } from '#providers/StateProvider'
import { PostInfoModalProps } from '#types/appTypes'
import UserComment from '#components/user/UserComment'
import { useTranslation } from 'react-i18next'

const PostInfoModal: React.FC<PostInfoModalProps> = ({ userId, postId, onClose }) => {
	const [state] = useApp()
	const { t } = useTranslation()

	const user = state.users.find((u) => u.id === userId)
	const post = state.posts.find((p) => p.id === postId)
	const postComments = state.comments
		.filter((comment) => comment.postId === postId)
		.sort((a, b) => b.id - a.id)

	if (!user || !post) return null

	return (
		<AppModal onClose={onClose} width='60vw'>
			<Box sx={{ padding: 2, maxHeight: '80vh', overflowY: 'auto' }}>
				<Typography variant='h5' gutterBottom>
					{user.name}
				</Typography>
				<Typography variant='h6' gutterBottom>
					{post.title}
				</Typography>
				<Typography variant='body1' gutterBottom>
					{post.body}
				</Typography>

				<Box mt={4}>
					<Typography variant='h6'>{t('user.comments')}:</Typography>
					<Box
						sx={{
							maxHeight: '400px',
							overflowY: 'scroll',
							paddingRight: '10px',
						}}
					>
						{postComments.length > 0 ? (
							postComments.map((comment) => (
								<Box key={comment.id} mt={2}>
									<UserComment comment={comment} />
								</Box>
							))
						) : (
							<Typography variant='body2' color='textSecondary'>
								{t('user.no_comments_yet')}
							</Typography>
						)}
					</Box>
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
					<Button variant='outlined' color='primary' onClick={onClose}>
						{t('modal.close')}
					</Button>
				</Box>
			</Box>
		</AppModal>
	)
}

export default PostInfoModal

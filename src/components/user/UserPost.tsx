import React, { useState } from 'react'
import {
	Grid2,
	Card,
	CardContent,
	Typography,
	Button,
	CircularProgress,
	Box,
	Divider,
	Link,
} from '@mui/material'
import { UserPostProps } from '#types/appTypes'
import { useApp } from '#providers/StateProvider'
import { useTranslation } from 'react-i18next'

const UserPost: React.FC<UserPostProps> = ({ post, onDelete, onPostInfo }) => {
	const [loading, setLoading] = useState(false)
	const [state] = useApp()
	const { t } = useTranslation()

	const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation()
		setLoading(true)
		try {
			await onDelete(post.id)
		} finally {
			setLoading(false)
		}
	}

	const postComments = state.comments.filter((comment) => comment.postId === post.id)

	return (
		<Grid2
			key={post.id}
			size={{ xs: 12, sm: 6, md: 4 }}
			data-testid={`user-post-${post.userId}-${post.id}`}
		>
			<Card
				sx={{
					height: '100%', // Ensure card takes full height of its container
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<CardContent
					sx={{
						paddingTop: 2,
						paddingBottom: 2,
						'&:last-child': {
							paddingBottom: 2, // Override the default 24px padding for the last child
						},
						flexGrow: 1, // Allow content to grow and take up available space
						display: 'flex',
						flexDirection: 'column',
						cursor: 'pointer',
					}}
					onClick={() => onPostInfo(post.id)} // Trigger PostInfoModal
				>
					<Box display='flex' justifyContent='space-between' alignItems='flex-start'>
						{/* Post Title */}
						<Typography variant='h6' sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
							{post.title}
						</Typography>

						{/* Outlined Delete Button */}
						<Button
							variant='outlined'
							color='error'
							onClick={handleDelete}
							disabled={loading}
							sx={{
								minWidth: '6em',
								minHeight: '1em',
								padding: '6px 16px', // Small padding to keep the button compact
								marginLeft: '16px', // Spacing between title and button
								alignSelf: 'flex-start', // Align button to the top of the content
							}}
							data-testid={`delete-button-${post.id}`}
						>
							{loading ? <CircularProgress role='progressbar' size={20} /> : t('user.delete')}
						</Button>
					</Box>

					{/* Post Body */}
					<Typography variant='body2' sx={{ marginTop: 2 }}>
						{post.body}
					</Typography>

					<Box
						sx={{
							marginTop: 'auto', // Ensure this container stays at the bottom
							width: '100%', // Ensure full width
						}}
					>
						{/* Divider Above Comments */}
						<Divider sx={{ my: 2 }} />

						{/* Link to Open PostInfoModal */}
						<Link
							component='button'
							variant='body2'
							underline='hover'
							data-testid={`post-title-${post.id}`}
						>
							{postComments.length} {t('user.comments', { count: postComments.length })}
						</Link>
					</Box>
				</CardContent>
			</Card>
		</Grid2>
	)
}

export default UserPost

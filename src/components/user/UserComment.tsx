import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { UserCommentProps } from '#types/appTypes'

const UserComment = ({ comment }: UserCommentProps) => {
	return (
		<Box my={2} p={2} bgcolor='lightgray' borderRadius='8px'>
			{/* Name and Email Container */}
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<Typography variant='subtitle1' fontWeight='bold'>
					{comment.name}
				</Typography>

				{/* Email Aligned to the Right */}
				<Link href={`mailto:${comment.email}`} sx={{ ml: 2 }}>
					{comment.email}
				</Link>
			</Box>

			{/* Comment Body */}
			<Typography variant='body1' mt={1}>
				{comment.body}
			</Typography>
		</Box>
	)
}

export default UserComment

import React, { useEffect, useRef, useState } from 'react'
import {
	Box,
	Typography,
	Button,
	Link,
	Grid2,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { UserPaneProps } from '#types/appTypes'
import UserPost from '#components/user/UserPost'
import { useTranslation } from 'react-i18next'
import { useActions, usePosts, useUsers } from '#src/stores/appStore'

const UserPane: React.FC<UserPaneProps> = ({ userId, expanded: initExpanded = false }) => {
	const { t } = useTranslation() // Using i18next for translations
	const [expanded, setExpanded] = useState<boolean>(initExpanded) // Accordion state
	const divRef = useRef<HTMLDivElement>(null) // Type the ref properly
	const initRef = useRef(true)
	const users = useUsers()
	const posts = usePosts()
	const actions = useActions()

	if (!userId) return null // Add this check before filtering posts

	const user = users.find((user) => user.id === userId)
	const postsSorted = posts.filter((post) => post.userId === userId).sort((a, b) => b.id - a.id)

	if (!user) {
		return <Typography variant='body1'>{t('user.user_not_found')}</Typography> // Use translation for 'User not found'
	}

	useEffect(() => {
		if (initRef.current) {
			initRef.current = false
			return
		}
		// Expand on post add
		if (!expanded) handleAccordionToggle()
	}, [postsSorted.length])

	const handleAccordionToggle = () => {
		setExpanded(!expanded)
		if (!expanded) {
			setTimeout(() => divRef?.current?.scrollIntoView({ behavior: 'smooth' }), 250)
		}
	}

	return (
		<Accordion
			expanded={expanded}
			sx={{ marginTop: '1em' }}
			onChange={handleAccordionToggle}
			ref={divRef}
			data-testid={`user-pane-${userId}`}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
					{/* Convert username to a clickable link */}
					<Link
						component='button'
						variant='h5'
						underline='hover'
						sx={{ zIndex: '1' }}
						onClick={(event) => {
							event.stopPropagation()
							actions.setModals({ userInfo: { userId } })
						}}
					>
						{user.name}
					</Link>

					<Link
						component='button'
						variant='body1'
						underline='hover'
						sx={{ position: 'absolute', left: 0, right: 0, zIndex: '0' }}
					>
						{t('user.posts', { count: postsSorted.length })} {/* Pluralized posts count */}
					</Link>

					{/* Add Post Button */}
					<Button
						variant='contained'
						onClick={(event) => {
							event.stopPropagation()
							actions.setModals({ addPost: { userId } })
						}}
						sx={{ marginLeft: '16px', marginRight: '16px' }}
					>
						{t('user.add_post')} {/* Translated Add Post */}
					</Button>
				</Box>
			</AccordionSummary>

			{/* Pane Body - Displaying Sorted Posts */}
			<AccordionDetails>
				<Grid2 container spacing={2}>
					{postsSorted.length === 0 ? (
						<Typography variant='body1' color='textSecondary'>
							{t('user.no_posts_available')} {/* Translated no posts available */}
						</Typography>
					) : (
						postsSorted.map((post) => <UserPost key={post.id} post={post} />)
					)}
				</Grid2>
			</AccordionDetails>
		</Accordion>
	)
}

export default UserPane

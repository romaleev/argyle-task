import React, { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import UserPane from '#components/user/UserPane'
import AddPostModal from '#components/modal/AddPostModal'
import UserInfoModal from '#components/modal/UserInfoModal'
import ErrorModal from '#components/modal/ErrorModal'
import PostInfoModal from '#components/modal/PostInfoModal'
import { useTranslation } from 'react-i18next'
import { useUsers, useActions } from '#src/stores/appStore'

const PostPage = () => {
	const [loading, setLoading] = useState(true)
	const users = useUsers()
	const actions = useActions()
	const { t } = useTranslation()

	useEffect(() => {
		const loadData = async () => {
			try {
				await actions.fetch()
				setLoading(false)
			} catch (error) {
				console.error(error)
				actions.setModals({ errorInfo: { errorMessage: `${t('postPage.loadError')}: ${error}` } })
			}
		}

		loadData()
	}, [])

	return (
		<Box>
			{loading ? (
				<Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
					<CircularProgress role='progressbar' />
				</Box>
			) : (
				<>
					<h1>{t('postPage.title')}</h1>
					{users.map((user, index) => (
						<React.Fragment key={user.id}>
							<UserPane userId={user.id} expanded={index === 0} />
						</React.Fragment>
					))}
				</>
			)}

			<AddPostModal />
			<UserInfoModal />
			<PostInfoModal />
			<ErrorModal />
		</Box>
	)
}

export default PostPage

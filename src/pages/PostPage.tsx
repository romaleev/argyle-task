import React, { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useApp } from '#providers/StateProvider'
import { deletePost, fetchPosts, fetchUsers, fetchComments, addPost } from '#api/postsApi' // Import comments API
import UserPane from '#components/user/UserPane'
import AddPostModal from '#components/modal/AddPostModal'
import UserInfoModal from '#components/modal/UserInfoModal'
import ErrorModal from '#components/modal/ErrorModal'
import PostInfoModal from '#components/modal/PostInfoModal'
import { Post } from '#types/appTypes'
import { useTranslation } from 'react-i18next'

const PostPage: React.FC = () => {
	const [state, dispatch] = useApp()
	const [addPostUserID, setAddPostUserID] = useState<number | null>(null)
	const [userInfoID, setUserInfoID] = useState<number | null>(null)
	const [postInfoID, setPostInfoID] = useState<{ userId: number; postId: number } | null>(null)
	const [errorModalText, setErrorModalText] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const { t } = useTranslation()

	useEffect(() => {
		const loadData = async () => {
			try {
				const [posts, users, comments] = await Promise.all([
					fetchPosts(),
					fetchUsers(),
					fetchComments(),
				])
				dispatch({ posts, users, comments }) // Dispatch comments to global state
				setLoading(false)
			} catch (error) {
				console.error(error)
				setErrorModalText(`${t('postPage.loadError')}: ${error}`) // Set error text
			}
		}

		loadData()
	}, [])

	const handleAddPost = async (post: Omit<Post, 'id'>) => {
		const newPost = await addPost(
			{ title: post.title, body: post.body, userId: post.userId },
			state.posts,
		)
		dispatch({
			posts: [...state.posts, newPost],
		})
	}

	const handleDeletePost = async (postId: number) => {
		try {
			await deletePost(postId) // Delete post via API
			const updatedPosts = state.posts.filter((post) => post.id !== postId)
			dispatch({ posts: updatedPosts }) // Update state
		} catch (error) {
			console.error(error)
			setErrorModalText(`${t('postPage.deleteError')}: ${error}`) // Set error text
		}
	}

	return (
		<Box>
			{loading ? (
				<Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
					<CircularProgress role='progressbar' />
				</Box>
			) : (
				<>
					<h1>{t('postPage.title')}</h1>
					{state.users.map((user, index) => (
						<React.Fragment key={user.id}>
							<UserPane
								userId={user.id}
								expanded={index === 0}
								onPostInfo={(postId: number) => setPostInfoID({ userId: user.id, postId })}
								onAddPost={() => setAddPostUserID(user.id)}
								onUserInfo={() => setUserInfoID(user.id)} // Pass onUserInfo
								onDeletePost={handleDeletePost} // Pass the delete post handler
							/>
						</React.Fragment>
					))}
				</>
			)}

			{/* Add Post Modal */}
			{addPostUserID !== null && (
				<AddPostModal
					userId={addPostUserID}
					onAddPost={handleAddPost}
					onClose={() => setAddPostUserID(null)}
				/>
			)}

			{/* User Info Modal */}
			{userInfoID !== null && (
				<UserInfoModal userId={userInfoID} onClose={() => setUserInfoID(null)} />
			)}

			{postInfoID !== null && (
				<PostInfoModal
					userId={postInfoID.userId}
					postId={postInfoID.postId}
					onClose={() => setPostInfoID(null)}
				/>
			)}

			{errorModalText !== null && (
				<ErrorModal
					errorMessage={errorModalText || ''}
					onClose={() => setErrorModalText(null)} // Clear error text on close
				/>
			)}
		</Box>
	)
}

export default PostPage

import ky from 'ky'
import { Post, User, Comment } from '#types/appTypes'
import { urls } from '#src/config'

export const fetchPosts = async (): Promise<Post[]> => {
	return await ky.get(urls.posts).json()
}

export const fetchUsers = async (): Promise<User[]> => {
	return await ky.get(urls.users).json()
}

export const fetchComments = async (): Promise<Comment[]> => {
	return await ky.get(urls.comments).json()
}

export const addPost = async (post: Omit<Post, 'id'>, posts: Post[]): Promise<Post> => {
	await ky
		.post(urls.posts, {
			json: post,
		})
		.json()

	const lastPostId = posts.length > 0 ? Math.max(...posts.map((post) => post.id)) : 0
	const id = lastPostId + 1

	return { ...post, id }
}

export const deletePost = async (postId: number) => {
	return ky.delete(`${urls.posts}/${postId}`)
}

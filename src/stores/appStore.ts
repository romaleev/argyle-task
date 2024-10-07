import { AppActions, AppModals, AppState, Post } from '#types/appTypes'
import { addPost, deletePost, fetchComments, fetchPosts, fetchUsers } from '#api/postsApi'
import { create } from 'zustand/react'

export const useAppStore = create<AppState & { actions: AppActions }>((set, get) => ({
	posts: [],
	users: [],
	comments: [],
	modals: {},

	actions: {
		fetch: async () => {
			const [posts, users, comments] = await Promise.all([
				fetchPosts(),
				fetchUsers(),
				fetchComments(),
			])
			set({ posts, users, comments })
		},
		addPost: async (post: Omit<Post, 'id'>) => {
			const newPost = await addPost(
				{ title: post.title, body: post.body, userId: post.userId },
				get().posts,
			)
			const posts = [...get().posts, newPost]
			set({ posts })
		},
		deletePost: async (postId: number) => {
			await deletePost(postId)
			const posts = get().posts.filter((post) => post.id !== postId)
			set({ posts })
		},

		setModals: (modals: AppModals) => {
			set({ modals })
		},

		getState: () => get(),
		setState: (partialState: Partial<AppState>) => set(partialState),
	},
}))

// Selectors
export const usePosts = () => useAppStore((state) => state.posts)
export const useUsers = () => useAppStore((state) => state.users)
export const useComments = () => useAppStore((state) => state.comments)
export const useActions = () => useAppStore((state) => state.actions)
export const useModals = () => useAppStore((state) => state.modals)

import React from 'react'

export interface Geo {
	lat: string
	lng: string
}

export interface Address {
	street: string
	suite: string
	city: string
	zipcode: string
	geo: Geo
}

export interface Company {
	name: string
	catchPhrase: string
	bs: string
}

export interface User {
	id: number
	name: string
	username: string
	email: string
	address: Address
	phone: string
	website: string
	company: Company
}

export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface Comment {
	postId: number
	id: number
	name: string
	email: string
	body: string
}

export interface AppModals {
	addPost?: {
		userId: number
	}
	userInfo?: {
		userId: number
	}
	postInfo?: {
		userId: number
		postId: number
	}
	errorInfo?: {
		errorMessage: string
	}
}

export interface AppState {
	posts: Post[]
	users: User[]
	comments: Comment[]
	modals?: AppModals
}

export interface AppActions {
	fetch: () => Promise<void>
	addPost: (post: Omit<Post, 'id'>) => Promise<void>
	deletePost: (postId: number) => Promise<void>
	setModals: (modals: AppModals) => void
	getState: () => AppState
	setState: (partialState: Partial<AppState>) => void
}

export interface PostFormInputs {
	title: string
	body: string
}

export interface UserPostProps {
	post: Post
}

export interface UserPaneProps {
	userId: number
	expanded?: boolean
}

export interface UserCommentProps {
	comment: Comment
}

export interface AppModalProps {
	onClose?: () => void
	children?: React.ReactNode
	width?: string
}

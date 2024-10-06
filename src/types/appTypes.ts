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

export interface AppState {
	posts: Post[]
	users: User[]
	comments: Comment[]
}

export interface PostFormInputs {
	title: string
	body: string
}

export interface UserPostProps {
	post: Post
	onPostInfo: (postId: number) => void
	onDelete: (postId: number) => void // Add delete post handler
}

export interface UserPaneProps {
	userId: number
	onPostInfo: (postId: number) => void
	onUserInfo: (userId: number) => void
	onAddPost: (post: number) => void
	onDeletePost: (postId: number) => void // Add delete post handler
	expanded?: boolean
}

export interface UserCommentProps {
	comment: Comment
}

export interface AppModalProps {
	onClose: () => void
	children?: React.ReactNode
	width?: string
}

export interface AddPostModalProps extends AppModalProps {
	userId: number
	onAddPost: (post: Omit<Post, 'id'>) => Promise<void>
}

export interface ErrorModalProps extends AppModalProps {
	errorMessage: string
}

export interface UserInfoModalProps extends AppModalProps {
	userId: number
}

export interface PostInfoModalProps extends AppModalProps {
	userId: number
	postId: number
}

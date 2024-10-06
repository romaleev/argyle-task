import React from 'react'
import { render, screen } from '@testing-library/react'
import UserComment from '#components/user/UserComment'
import mockComments from '#tests/mocks/comments.json'

const mockComment = mockComments[0]

describe('UserComment', () => {
	test('renders comment name, email, and body correctly', () => {
		render(<UserComment comment={mockComment} />)

		// Check if the commenter's name is rendered
		expect(screen.getByText(mockComment.name)).toBeInTheDocument()

		// Check if the commenter's email is rendered
		expect(screen.getByText(mockComment.email)).toBeInTheDocument()

		// Check if the comment body is rendered
		const commentBody = new RegExp(mockComment.body.replace(/\s+/g, ' ').trim())
		expect(screen.getByText(commentBody)).toBeInTheDocument()
	})
})

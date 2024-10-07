import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import PostPage from '#pages/PostPage'

function App() {
	return (
		<Router>
			<Container
				sx={{
					maxWidth: '1280px', // Custom width
				}}
				maxWidth={false} // Disable default maxWidth constraint
			>
				<Routes>
					<Route path='/' element={<PostPage />} />
				</Routes>
			</Container>
		</Router>
	)
}

export default App

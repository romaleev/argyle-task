import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import { StateProvider } from '#providers/StateProvider'
import PostPage from '#pages/PostPage'

function App() {
	return (
		<StateProvider>
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
		</StateProvider>
	)
}

export default App

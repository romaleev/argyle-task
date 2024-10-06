import React from 'react'
import { render, act } from '@testing-library/react'
import { StateProvider, useApp } from '#providers/StateProvider'
import { AppState } from '#types/appTypes'
import mockUsers from '#tests/mocks/users.json'

const mockUser = mockUsers[0]
const TestComponent = ({
	onTest,
}: {
	onTest: (state: AppState, dispatch: (payload: Partial<AppState>) => void) => void
}) => {
	const [state, dispatch] = useApp()
	React.useEffect(() => {
		onTest(state, dispatch)
	}, [state, dispatch])
	return null
}

describe('AppState', () => {
	it('should initialize with the correct default state', () => {
		const mockInitialState: AppState = {
			posts: [],
			users: [],
			comments: [],
		}

		let testState: AppState | undefined

		render(
			<StateProvider initialState={mockInitialState}>
				<TestComponent onTest={(state) => (testState = state)} />
			</StateProvider>,
		)

		expect(testState).toEqual(mockInitialState)
	})

	it('should update the state when dispatch is called', () => {
		const mockInitialState: AppState = {
			posts: [],
			users: [],
			comments: [],
		}

		let testState: AppState | undefined
		let testDispatch: (payload: Partial<AppState>) => void

		render(
			<StateProvider initialState={mockInitialState}>
				<TestComponent
					onTest={(state, dispatch) => {
						testState = state
						testDispatch = dispatch
					}}
				/>
			</StateProvider>,
		)

		const newState = {
			posts: [{ id: 1, title: 'Test Post', body: 'Test Body', userId: 1 }],
		}

		act(() => {
			testDispatch(newState)
		})

		expect(testState?.posts).toEqual(newState.posts)
	})

	it('should merge new state with the existing state', () => {
		const initialState: AppState = {
			posts: [{ id: 1, title: 'Test Post', body: 'Test Body', userId: 1 }],
			users: [],
			comments: [],
		}

		let testState: AppState | undefined
		let testDispatch: (payload: Partial<AppState>) => void

		render(
			<StateProvider initialState={initialState}>
				<TestComponent
					onTest={(state, dispatch) => {
						testState = state
						testDispatch = dispatch
					}}
				/>
			</StateProvider>,
		)

		const additionalState = {
			users: [mockUser],
		}

		act(() => {
			testDispatch(additionalState)
		})

		expect(testState?.posts.length).toBe(1)
		expect(testState?.users.length).toBe(1)
	})
})

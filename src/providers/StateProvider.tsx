import React, { createContext, useReducer, useContext } from 'react'
import { AppState } from '#types/appTypes'

// Initial global state
const initialState: AppState = {
	posts: [],
	users: [],
	comments: [],
}

// App reducer to handle the payload by merging it into the state
const stateReducer = (state: AppState, payload: Partial<AppState>): AppState => {
	return {
		...state,
		...payload, // Merge the payload into the current state
	}
}

// Create context
const StateContext = createContext<
	[state: AppState, dispatch: (payload: Partial<AppState>) => void]
>([initialState, () => null])

// StateProvider to wrap the application
export const StateProvider: React.FC<{ children: React.ReactNode; initialState?: AppState }> = ({
	children,
	initialState: providedState,
}) => {
	const [state, dispatch] = useReducer(stateReducer, providedState || initialState) // Use provided initialState if passed
	return <StateContext.Provider value={[state, dispatch]}>{children}</StateContext.Provider>
}

// Custom hook to use the app state and dispatch
export const useApp = (): [AppState, (newState: Partial<AppState>) => void] => {
	const context = useContext(StateContext)
	if (context === undefined) {
		throw new Error('useApp must be used within StateContextProvider')
	}

	const [state, dispatch] = context

	return [
		state,
		(newState: Partial<AppState>) => {
			if (
				Object.keys(newState).some(
					(key) => newState[key as keyof AppState] !== state[key as keyof AppState],
				)
			)
				dispatch(newState)
		},
	]
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import '#src/index.css'
import App from '#src/App'
import reportWebVitals from '#src/reportWebVitals'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from '#src/i18n'

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
	},
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<I18nextProvider i18n={i18n}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</I18nextProvider>,
)

reportWebVitals()

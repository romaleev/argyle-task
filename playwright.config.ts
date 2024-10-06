import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: 'src/tests/e2e',
	retries: 1, // Set the number of retries on failure
	timeout: 5000, // Timeout for each test
	use: {
		baseURL: 'http://localhost:3000',
		headless: true, // Run tests in headless mode
		viewport: { width: 1280, height: 720 },
		ignoreHTTPSErrors: true,
		video: 'on', // Record video for each test
		screenshot: 'on', // Take screenshot if test fails
	},
	reporter: [['html', { outputFolder: 'dist/playwright-report' }]],
	fullyParallel: true,
})

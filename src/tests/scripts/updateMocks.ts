import fs from 'fs/promises'
import path from 'path'
import ky from 'ky'
import { urls } from '#src/config'

const fetchAndSave = async (url: string, filename: string) => {
	try {
		const data = await ky.get(url).json()

		const filePath = path.join(process.cwd(), filename)
		await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

		console.log(`Saved data to ${filePath}`)
	} catch (error) {
		console.error(`Failed to fetch and save data from ${url}:`, error)
	}
}

export const updateMocks = async () => {
	try {
		await Promise.all([
			fetchAndSave(urls.posts, 'src/tests/mocks/posts.json'),
			fetchAndSave(urls.users, 'src/tests/mocks/users.json'),
			fetchAndSave(urls.comments, 'src/tests/mocks/comments.json'),
		])

		console.log('Mock data successfully updated.')
	} catch (error) {
		console.error('Failed to update mocks:', error)
	}
}

await updateMocks()

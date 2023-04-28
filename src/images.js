import fs from 'fs'

export function get_images() {
	const image_names = ['slide_next', 'slide_prev', 'playlist_next', 'playlist_prev']

	let data
	let base64String
	let images = {}

	image_names.forEach(function (filename) {
		// Read the contents of the image file and convert the data to a base64-encoded string
		data = fs.readFileSync(`./icons/${filename}.png`)
		base64String = Buffer.from(data).toString('base64')
		images[filename] = base64String
	})

	return images
}

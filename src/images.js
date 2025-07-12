import fs from 'fs'

export function get_images() {
	const image_names = []
	image_names.push(...['slide_next', 'slide_prev', 'playlist_next', 'playlist_prev']) // navigation icons
	image_names.push(...['state_black', 'state_background', 'state_logo', 'state_blank']) // presentation_state_icons // slide = background + text
	image_names.push(...['state_play', 'state_pause', 'state_stop']) // video states
	image_names.push(...['state_live_play', 'state_live_stop']) // live video states

	let data
	let base64String
	let images = {}

	image_names.forEach(function (filename) {
		// Read the contents of the image file and convert the data to a base64-encoded string
		data = fs.readFileSync(`./icons/${filename}.png`)
		base64String = Buffer.from(data).toString('base64')
		images[filename] = base64String
	})

	images['state_page'] = images['state_background'] //adding state_slide as placeholder copy of state_background

	return images
}

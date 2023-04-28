import { combineRgb } from '@companion-module/base'
import { get_images } from './images.js'

export function getPresetDefinitions() {
	const navigate0 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `navigate to next slide`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'slide', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '24',
			png64: get_images()['slide_next'],
			alignment: 'left:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'navigate_to',
						options: {
							navigate_to: 0,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [], // You can add some presets from your module here
	}
	const navigate1 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `navigate to prev slide`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'slide', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '24',
			png64: get_images()['slide_prev'],
			alignment: 'right:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'navigate_to',
						options: {
							navigate_to: 1,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [], // You can add some presets from your module here
	}
	const navigate2 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `navigate to next playlist item`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'song', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '24',
			png64: get_images()['playlist_next'],
			alignment: 'right:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'navigate_to',
						options: {
							navigate_to: 2,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [], // You can add some presets from your module here
	}
	const navigate3 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `navigate to prev playlist item`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'song', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '24',
			png64: get_images()['playlist_prev'],
			alignment: 'left:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'navigate_to',
						options: {
							navigate_to: 3,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [], // You can add some presets from your module here
	}

	return { navigate0: navigate0, navigate1: navigate1, navigate2: navigate2, navigate3: navigate3 }
}

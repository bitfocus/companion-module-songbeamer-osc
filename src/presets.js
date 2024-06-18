import { combineRgb } from '@companion-module/base'
import { get_images } from './images.js'

export function getPresetDefinitions() {
	let result = {}

	// Navigation

	const navigate0 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
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
							navigate_to: 'nextpage',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	const navigate1 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
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
							navigate_to: 'prevpage',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	const navigate2 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
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
							navigate_to: 'playlist/next',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	const navigate3 = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
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
							navigate_to: 'playlist/previous',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	result['navigate0'] = navigate0
	result['navigate1'] = navigate1
	result['navigate2'] = navigate2
	result['navigate3'] = navigate3

	const navigate_page = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
		name: `navigate to playlist item 1`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'Playlist\n1', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '18',
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
							navigate_to: 'playlist/item',
							number: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	const navigate_playlist = {
		type: 'button', // This must be 'button' for now
		category: 'Navigation relative and absolute',
		name: `navigate to page number 1`, // A name for the preset. Shown to the user when they hover over it
		style: {
			// This is the minimal set of style properties you must define
			text: 'Page\n1', // `$(generic-module:some-variable)`, // You can use variables from your module here
			size: '18',
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
							navigate_to: 'presentation/page',
							number: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	result['navigate_page'] = navigate_page
	result['navigate_playlist'] = navigate_playlist

	// Page captions
	const page_captions = [
		'Title',
		'Intro',
		'Verse 1',
		'Verse 2',
		'Verse 3',
		'Chorus 1',
		'Chorus 2',
		'Pre-Chorus',
		'Bridge',
		'Ending',
	]
	page_captions.forEach(function (value) {
		result['navigate_pagecaption_' + value] = {
			type: 'button', // This must be 'button' for now
			category: 'Navigation by page caption', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `navigate to pagecaption ${value}`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `➔\n${value}`,
				size: '18pt',
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
								navigate_to: 'presentation/pagecaption',
								presentation_pagecaption: `${value}`,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	// Presentation state
	const state_current = {
		type: 'button', // This must be 'button' for now
		category: 'Presentation state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `get current state`, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '?',
			size: '24',
			png64: get_images()['state_black'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'presentation_state',
						options: {
							should_change: false,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'presentation_state_advanced',
				options: {
					presentation_state: '0',
				},
			},
			{
				feedbackId: 'presentation_state_advanced',
				options: {
					presentation_state: '1',
				},
			},
			{
				feedbackId: 'presentation_state_advanced',
				options: {
					presentation_state: '2',
				},
			},
			{
				feedbackId: 'presentation_state_advanced',
				options: {
					presentation_state: '3',
				},
			},
		],
	}

	const state_black = {
		type: 'button', // This must be 'button' for now
		category: 'Presentation state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `presentation_state -> black `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_black'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'presentation_state',
						options: {
							presentation_state: '0',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const state_background = {
		type: 'button', // This must be 'button' for now
		category: 'Presentation state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `presentation_state -> background `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_background'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'presentation_state',
						options: {
							presentation_state: '1',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const state_page = {
		type: 'button', // This must be 'button' for now
		category: 'Presentation state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `presentation_state -> page `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: 'page',
			size: '24',
			png64: get_images()['state_page'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'presentation_state',
						options: {
							presentation_state: '2',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const state_logo = {
		type: 'button', // This must be 'button' for now
		category: 'Presentation state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `presentation_state -> logo `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_logo'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'presentation_state',
						options: {
							presentation_state: '3',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	result['state_current'] = state_current
	result['state_black'] = state_black
	result['state_background'] = state_background
	result['state_page'] = state_page
	result['state_logo'] = state_logo

	// Video state
	const video_state_current = {
		type: 'button', // This must be 'button' for now
		category: 'Video state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `get current video playback state`, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '?',
			size: '24',
			png64: get_images()['state_play'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'video_state',
						options: {
							should_change: false,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'video_state_advanced',
				options: {
					video_state: '0',
				},
			},
			{
				feedbackId: 'video_state_advanced',
				options: {
					video_state: '1',
				},
			},
			{
				feedbackId: 'video_state_advanced',
				options: {
					video_state: '2',
				},
			},
		],
	}

	const video_state_play = {
		type: 'button', // This must be 'button' for now
		category: 'Video state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `video_state -> play `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_play'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'video_state',
						options: {
							video_state: '0',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const video_state_pause = {
		type: 'button', // This must be 'button' for now
		category: 'Video state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `video_state -> pause `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_pause'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'video_state',
						options: {
							video_state: '1',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const video_state_stop = {
		type: 'button', // This must be 'button' for now
		category: 'Video state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `video_state -> stop `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_stop'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'video_state',
						options: {
							video_state: '2',
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	result['video_state_current'] = video_state_current
	result['video_state_play'] = video_state_play
	result['video_state_pause'] = video_state_pause
	result['video_state_stop'] = video_state_stop

	// liveVideo state
	const livevideo_state_current = {
		type: 'button', // This must be 'button' for now
		category: 'livevideo state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `get current live video playback state`, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '?',
			size: '24',
			png64: get_images()['state_live_play'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'livevideo_state',
						options: {
							should_change: false,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'livevideo_state_advanced',
				options: {
					livevideo_state: '0',
				},
			},
		],
	}

	const livevideo_state_play = {
		type: 'button', // This must be 'button' for now
		category: 'livevideo state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `livevideo_state -> play `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_live_play'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'livevideo_state',
						options: {
							livevideo_state: true,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const livevideo_state_stop = {
		type: 'button', // This must be 'button' for now
		category: 'livevideo state', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
		name: `livevideo_state -> stop `, // A name for the preset. Shown to the user when they hover over it
		style: {
			text: '',
			size: '24',
			png64: get_images()['state_live_stop'],
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'livevideo_state',
						options: {
							livevideo_state: false,
							should_change: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	result['livevideo_state_current'] = livevideo_state_current
	result['livevideo_state_play'] = livevideo_state_play
	result['livevideo_state_stop'] = livevideo_state_stop

	return result
}

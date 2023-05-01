import { combineRgb } from '@companion-module/base'
import { get_images } from './images.js'

export function getPresetDefinitions() {
	let result = {}

	// Navigation

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
		feedbacks: [],
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
		feedbacks: [],
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
		feedbacks: [],
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
		feedbacks: [],
	}
	result['navigate0'] = navigate0
	result['navigate1'] = navigate1
	result['navigate2'] = navigate2
	result['navigate3'] = navigate3

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

	return result
}

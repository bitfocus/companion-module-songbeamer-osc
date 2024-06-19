import { presentation_states, video_states, livevideo_states, comparators } from './choices.js'
import { get_images } from './images.js'

export function getFeedbackDefinitions(self, osc) {
	const feedbacks = {
		presentation_state_advanced: {
			type: 'advanced', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation State (image + text)',
			description: 'Sets text and icon based on presentation state',
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'presentation_state',
					default: '0',
					choices: presentation_states.map((item, index) => {
						return {
							id: index.toString(),
							label: item,
						}
					}),
					minChoicesForSearch: 0,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('presentation_state')
				//self.log('debug', `comparing (${var_state}) with (${states[feedback.options.presentation_state]})`)
				if (var_state == presentation_states[feedback.options.presentation_state]) {
					switch (var_state) {
						case 'black':
							return { text: '', png64: get_images()['state_black'] }
						case 'background':
							return { text: '', png64: get_images()['state_background'] }
						case 'page':
							return { text: 'page', png64: get_images()['state_page'] }
						case 'logo':
							return { text: '', png64: get_images()['state_logo'] }
						default:
							self.log(
								'error',
								'feedback presentation_state_advanced did use a state which is not configured for automatic feedback'
							)
							return { text: 'error' }
					}
				}
			},
			subscribe: () => {
				const path = '/presentation/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		presentation_state: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation State',
			description: 'custom feedback based on presentation state',
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'presentation_state',
					default: '0',
					choices: presentation_states.map((item, index) => {
						return {
							id: index.toString(),
							label: item,
						}
					}),
					minChoicesForSearch: 0,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('presentation_state')
				// self.log('debug', `comparing (${var_state}) with (${states[feedback.options.presentation_state]})`)
				if (var_state == presentation_states[feedback.options.presentation_state]) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		presentation_page: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation Page',
			description: 'Checks presentation page',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'number',
					label: 'Page #',
					id: 'presentation_page',
					default: 1,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_page') == feedback.options.presentation_page) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/page'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}}`)
			},
		},

		presentation_pagecaption: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation pagecaption',
			description: 'Checks presentation pagecaption',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'textinput',
					label: 'pagecaption',
					id: 'presentation_pagecaption',
					default: 'Title',
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_pagecaption') == feedback.options.presentation_pagecaption) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/pagecaption'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}}`)
			},
		},

		playlist_itemindex: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Playlist item index',
			description: 'Checks playlist item index ',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'number',
					label: 'Playlist index #',
					id: 'playlist_itemindex',
					default: 1,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('playlist_itemindex') == feedback.options.playlist_itemindex) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/playlist/itemindex'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		presentation_filename: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'presentation filename',
			description: 'Checks presentation filename (without path)',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'textinput',
					label: 'Message text',
					id: 'presentation_filename',
					default: '',
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_filename') == feedback.options.presentation_filename) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/filename'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		presentation_message_text: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation Message Text',
			description: 'Checks presentation message',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'textinput',
					label: 'Message text',
					id: 'presentation_message_text',
					default: '',
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_message_text') == feedback.options.presentation_message_text) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/message/text'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
				self.log('warn', 'initialisation of presentation/message/text not possible - check #2')
			},
		},
		presentation_message_visible: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation Message Visibility',
			description: 'Checks visibility of presentation message',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'checkbox',
					label: 'message is visible?',
					id: 'presentation_message_visible',
					default: true,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_message_visible') == feedback.options.presentation_message_visible) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/message/visible'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
				self.log('warn', 'initialisation of presentation/message/visible not possible - check #2')
			},
		},
		presentation_pagecount: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'presentation pagecount',
			description: 'Checks presentation total page count',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'number',
					label: '# of pages',
					id: 'presentation_pagecount',
					default: 1,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('presentation_pagecount') == feedback.options.presentation_pagecount) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/presentation/pagecount'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		playlist_filename: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'playlist filename',
			description: 'Checks playlist item filename (without path)',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'textinput',
					label: 'Message text',
					id: 'playlist_filename',
					default: '',
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('playlist_filename') == feedback.options.playlist_filename) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/playlist/filename'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		playlist_count: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'playlist count',
			description: 'Checks playlist total count',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'number',
					label: '# of pages',
					id: 'playlist_count',
					default: 1,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				if (self.getVariableValue('playlist_count') == feedback.options.playlist_count) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/playlist/count'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		video_length: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'video length in seconds',
			description: 'Length of a video',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'Compare operation',
					id: 'video_length_comparator',
					default: '0',
					choices: comparators.map((item, index) => {
						return {
							id: index.toString(),
							label: item,
						}
					}),
					minChoicesForSearch: 0,
				},
				{
					type: 'number',
					label: 'time in seconds',
					id: 'video_length',
					default: 30,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				switch (comparators[feedback.options.video_length_comparator]) {
					case 'less':
						return self.getVariableValue('video_length') < feedback.options.video_length
					case 'less or equal':
						return self.getVariableValue('video_length') <= feedback.options.video_length
					case 'equal':
						return self.getVariableValue('video_length') == feedback.options.video_length
					case 'greater or equal':
						return self.getVariableValue('video_length') >= feedback.options.video_length
					case 'greater':
						return self.getVariableValue('video_length') > feedback.options.video_length
					default:
						self.log(
							'error',
							`${
								comparators[feedback.options.video_length_comparator]
							} video_length_comparator which is not configured for automatic feedback´`
						)
						return { text: 'error' }
				}
			},
			subscribe: () => {
				const path = '/video/length'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		video_state_advanced: {
			type: 'advanced', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Video State (image)',
			description: 'Sets text and icon based on video state',
			// options is how the user can choose the condition the feedback activates for
			options: [],
			callback: async () => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state = self.getVariableValue('video_state')
				switch (var_state) {
					case 'play':
						return { png64: get_images()['state_play'] }
					case 'pause':
						return { png64: get_images()['state_pause'] }
					case 'stop':
						return { png64: get_images()['state_stop'] }
					default:
						self.log(
							'error',
							'feedback video_state_advanced did use a state which is not configured for automatic feedback'
						)
						return { text: 'error' }
				}
			},
			subscribe: () => {
				const path = '/video/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		video_state: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Video State',
			description: 'custom feedback based on video state',
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'video_state',
					default: '0',
					choices: video_states.map((item, index) => {
						return {
							id: index.toString(),
							label: item,
						}
					}),
					minChoicesForSearch: 0,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('video_state')
				if (var_state == video_states[feedback.options.video_state]) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/video/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		livevideo_state_advanced: {
			type: 'advanced', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'livevideo State (image)',
			description: 'Sets icon based on live video state',
			// options is how the user can choose the condition the feedback activates for
			options: [],
			callback: async () => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('livevideo_state')
				switch (var_state) {
					case 'play':
						return { png64: get_images()['state_live_play'] }
					case 'stop':
						return { png64: get_images()['state_live_stop'] }
					default:
						self.log(
							'error',
							'feedback livevideo_state_advanced did use a state which is not configured for automatic feedback'
						)
						return { text: 'error' }
				}
			},
			subscribe: () => {
				const path = '/livevideo/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
		livevideo_state: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'live video State',
			description: 'custom feedback based on live video state',
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'livevideo_state',
					default: '0',
					choices: livevideo_states.map((item, index) => {
						return {
							id: index.toString(),
							label: item,
						}
					}),
					minChoicesForSearch: 0,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('livevideo_state')
				if (var_state == livevideo_states[feedback.options.livevideo_state]) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				const path = '/livevideo/state'
				osc.send({
					address: path,
					args: [],
				})
				self.log('debug', `Sent OSC to ${self.config.host}:${self.config.port} with ${path}`)
			},
		},
	}
	return feedbacks
}

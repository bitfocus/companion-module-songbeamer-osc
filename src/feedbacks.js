export function getFeedbackDefinitions(self, osc) {
	const feedbacks = {
		presentation_state: {
			type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
			name: 'Presentation State',
			description: 'Checks presentation state',
			defaultStyle: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				//TODO #4 Implement default style
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'presentation_state',
					default: '0',
					choices: [
						{ id: '0', label: 'black' },
						{ id: '1', label: 'background' },
						{ id: '2', label: 'page' },
						{ id: '3', label: 'logo' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: async (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// self.log('debug',`called feedback with ${JSON.stringify(feedback)}`)
				let var_state
				var_state = self.getVariableValue('presentation_state')
				const states = ['black', 'background', 'page', 'logo']
				// self.log('debug',`comparing ${var_state} with ${states[feedback.options.presentation_state]}`)
				if (var_state == states[feedback.options.presentation_state]) {
					return true
				} else {
					return false
				}
			},
			subscribe: (feedback) => {
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
			subscribe: (feedback) => {
				const path = '/presentation/page'
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
			subscribe: (feedback) => {
				const path = '/playlist/itemindex'
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
			subscribe: (feedback) => {
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
			subscribe: (feedback) => {
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
			subscribe: (feedback) => {
				const path = '/presentation/pagecount'
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

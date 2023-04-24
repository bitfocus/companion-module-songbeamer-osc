import { Regex } from '@companion-module/base'

export function getActionDefinitions(self, osc) {
	let path = ''
	let args = []
	const actions = {
		send_blank: {
			name: 'Send message without arguments',
			options: [
				{
					type: 'textinput',
					label: 'OSC Path',
					id: 'path',
					default: '/osc/path',
					useVariables: true,
				},
			],
			callback: async (event) => {
				path = await self.parseVariablesInString(event.options.path)
				args = []

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		presentation_state: {
			name: 'Change presentation state',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'presentation_state',
					default: '0',
					tooltip: 'Choose presentation state',
					choices: [
						{ id: '0', label: 'black' },
						{ id: '1', label: 'background' },
						{ id: '2', label: 'page' },
						{ id: '3', label: 'logo' },
					],
					minChoicesForSearch: 0,
				},
				{
					type: 'checkbox',
					label: 'Execute change',
					id: 'should_change',
					default: 'true',
					tooltip: 'disable in order to request state instead of changing it',
				},
			],
			callback: async (event) => {
				const presentation_state = await self.parseVariablesInString(event.options.presentation_state)
				const should_change = await self.parseVariablesInString(event.options.should_change)
				path = '/presentation/state'

				if (should_change == 'true') {
					const states = ['black', 'background', 'page', 'logo']
					args = [
						{
							type: 's',
							value: states[presentation_state],
						},
					]
					//TODO #7 Remove following line as workaround once songbeamer sends feedback
					self.setVariableValues({ presentation_state: states[presentation_state] })
					self.checkFeedbacks('presentation_state')
				} else {
					args = []
				}

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
			subscribe: (feedback) => {
				osc.send({
					address: '/presentation/state',
					args: [],
				})
			},
		},
		presentation_pagecount: {
			name: 'Get presentation page total',
			options: [],
			callback: async (event) => {
				path = '/presentation/pagecount'
				args = []

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		presentation_versemarker: {
			//TODO #3 Merge presentation_versemarker into navigate_to
			name: 'Change presentation page to verse marker',
			options: [
				{
					type: 'textinput',
					label: 'Verse marker',
					id: 'presentation_versemarker',
					default: 'Verse 1',
					tooltip: 'Choose any verse marker',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Execute change',
					id: 'should_change',
					default: 'true',
					tooltip: 'disable in order to request state instead of changing it',
				},
			],
			callback: async (event) => {
				const presentation_versemarker = await self.parseVariablesInString(event.options.presentation_versemarker)
				const should_change = await self.parseVariablesInString(event.options.should_change)
				path = '/presentation/pagecaption'
				self.log('warn', 'This endpoint is not correctly implemented in Songbeamer! #15') // TODO #15
				if (should_change == 'true') {
					args = [
						{
							type: 's',
							value: presentation_versemarker,
						},
					]
				} else {
					args = []
				}

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		presentation_language: {
			name: 'Change languages to be displayed',
			options: [
				{
					type: 'dropdown',
					label: 'Choose primary language',
					id: 'presentation_language_primary',
					default: '1',
					choices: [
						{ id: '1', label: '#1' },
						{ id: '2', label: '#2' },
						{ id: '3', label: '#3' },
						{ id: '4', label: '#4' },
					],
					minChoicesForSearch: 0,
				},
				{
					type: 'textinput',
					label: 'Combination of id-number of languages to be displayed',
					id: 'presentation_language',
					default: '1234',
					tooltip: 'Choose any combination of 1234 or type ALL',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
			],
			callback: async (event) => {
				self.log('warn', 'Songbeamer does not yet act upon the request  - check #6')
				const presentation_language_primary = await self.parseVariablesInString(
					event.options.presentation_language_primary
				)
				path = '/presentation/primarylanguage'
				args = [
					{
						type: 'i',
						value: parseInt(presentation_language_primary),
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)

				let presentation_language = await self.parseVariablesInString(event.options.presentation_language)
				path = '/presentation/language'
				args = [
					{
						type: 's',
						value: presentation_language,
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		presentation_message: {
			name: 'Change presentation message text',
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'presentation_message_text',
					default: '',
					tooltip: 'Type any message to display',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Show Message',
					id: 'presentation_message_visible',
					default: true,
				},
			],
			callback: async (event) => {
				let presentation_message_text = await self.parseVariablesInString(event.options.presentation_message_text)
				path = '/presentation/message/text'
				args = [
					{
						type: 's',
						value: presentation_message_text,
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
				let presentation_message_visible = await self.parseVariablesInString(event.options.presentation_message_visible)
				path = '/presentation/message/visible'
				args = [
					{
						type: 'i',
						value: presentation_message_visible === 'true' ? 1 : 0,
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		navigate_to: {
			//TODO #3 Merge presentation_versemarker into navigate_to
			name: 'Navigation within presentation and playlist (relative or absolute) ',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'navigate_to',
					default: '0',
					tooltip: 'Choose navigation action to be executed on presentation or playlist',
					choices: [
						{ id: '0', label: 'nextpage' },
						{ id: '1', label: 'prevpage' },
						{ id: '2', label: 'next playlist item' },
						{ id: '3', label: 'previous playlist item' },
						{ id: '4', label: 'navigate to playlist item' },
						{ id: '5', label: 'navigate to presentation page' },
					],
					minChoicesForSearch: 0,
				},
				{
					type: 'textinput',
					label: 'Playlist item number',
					id: 'navigate_to_playlistitem',
					tooltip: 'Number of the playlist item starting with 1 (API translates to 0 based index)',
					default: 1,
					isVisible: (options) => options.navigate_to == '4' && options.should_change,
					regex: Regex.SIGNED_NUMBER,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Page number',
					id: 'presentation_page',
					default: '1',
					isVisible: (options) => options.navigate_to == '5' && options.should_change,
					tooltip: 'Number of the page within the current presentation',
					regex: Regex.SIGNED_NUMBER,
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Execute change',
					id: 'should_change',
					default: 'true',
					tooltip: 'disable in order to request state instead of changing it',
				},
			],
			callback: async (event) => {
				const navigate_to = await self.parseVariablesInString(event.options.navigate_to)
				const should_change = await self.parseVariablesInString(event.options.should_change) // TODO #11 - read bool not str?
				switch (navigate_to) {
					case '0':
						path = '/presentation/nextpage'
						break
					case '1':
						path = '/presentation/prevpage'
						break
					case '2':
						path = '/playlist/next'
						break
					case '3':
						path = '/playlist/previous'
						break
					case '4':
						let navigate_to_playlistitem = await self.parseVariablesInString(event.options.navigate_to_playlistitem)
						path = '/playlist/itemindex'
						if (should_change == 'true') {
							args = [
								{
									type: 'i',
									value: parseInt(navigate_to_playlistitem) - 1,
								},
							]
						} else {
							args = []
						}
						break
					case '5':
						const presentation_page = await self.parseVariablesInString(event.options.presentation_page)
						path = '/presentation/page'
						if (should_change == 'true') {
							args = [
								{
									type: 'i',
									value: parseInt(presentation_page),
								},
							]
						} else {
							args = []
						}
						break
					default:
						self.log('debug', 'navigate_to option not recognized', navigate_to)
						break
				}

				//append execution indicator for relative actions
				if (navigate_to != '4' && navigate_to != '5') {
					args = [
						{
							type: 'i',
							value: should_change === 'true' ? 1 : 0,
						},
					]
				}

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
				// Remove the following lines once propper feedback is implemented in songbeamer - see #22
				self.log(
					'info',
					'Songbeamer OSC implementation is missing feedback for page/playlist changes #22 manually requesting variables'
				)
				self.log('info', 'Songbeamer OSC reports wrong page numbers after update via OSC #30')
				osc.send({
					address: '/playlist/itemindex',
					args: [],
				})
				osc.send({
					address: '/presentation/page',
					args: [],
				})
				osc.send({
					address: '/presentation/presentation_pagecount',
					args: [],
				})
			},
		},
		video_state: {
			name: 'Change video state',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'video_state',
					default: '0',
					tooltip: 'Choose video state',
					choices: [
						{ id: '0', label: 'play' },
						{ id: '1', label: 'pause' },
						{ id: '2', label: 'stop' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: async (event) => {
				let video_state = await self.parseVariablesInString(event.options.video_state)
				path = '/video/state'
				switch (video_state) {
					case '0':
						args = [
							{
								type: 's',
								value: 'play',
							},
						]
						break
					case '1':
						args = [
							{
								type: 's',
								value: 'pause',
							},
						]
						break
					case '2':
						args = [
							{
								type: 's',
								value: 'stop',
							},
						]
						break
					default:
						self.log('debug', 'video state not recoginzed ', video_state)
						break
				}

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		video_position: {
			name: 'Move to video position',
			options: [
				{
					type: 'textinput',
					label: 'Position in min',
					id: 'video_position',
					required: true,
					tooltip: 'Position of video to skip to as minutes with optional . as decimal delimiter',
					default: 1,
					regex: Regex.SIGNED_FLOAT,
					useVariables: true,
				},
			],
			callback: async (event) => {
				let video_position = await self.parseVariablesInString(event.options.video_position)
				self.log('warn', 'Video position is not correctly applied by Songbeamer 6.0.0d - check #16')
				path = '/video/position'
				args = [
					{
						type: 'f',
						value: parseFloat(video_position) / 24 / 60,
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		livevideo_state: {
			name: 'Change livevideo state',
			options: [
				{
					type: 'checkbox',
					label: 'Play',
					id: 'livevideo_state',
					default: true,
				},
			],
			callback: async (event) => {
				let livevideo_state = await self.parseVariablesInString(event.options.livevideo_state)
				path = '/livevideo/state'
				args = [
					{
						type: 's',
						value: livevideo_state === 'true' ? 'play' : 'stop',
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		send_int: {
			name: 'Send integer',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'int',
					default: 1,
					regex: Regex.SIGNED_NUMBER,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'OSC Path',
					id: 'path',
					default: '/osc/path',
					useVariables: true,
				},
			],
			callback: async (event) => {
				let int = await self.parseVariablesInString(event.options.int)
				path = await self.parseVariablesInString(event.options.path)
				args = [
					{
						type: 'i',
						value: parseInt(int),
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
		send_string: {
			name: 'Send string',
			options: [
				{
					type: 'textinput',
					label: 'OSC Path',
					id: 'path',
					default: '/osc/path',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'string',
					default: 'text',
					useVariables: true,
				},
			],
			callback: async (event) => {
				let string = await self.parseVariablesInString(event.options.string)
				path = await self.parseVariablesInString(event.options.path)
				args = [
					{
						type: 's',
						value: `${string}`,
					},
				]

				osc.send({
					address: path,
					args: args,
				})
				self.log(
					'debug',
					`Sent OSC to ${self.config.host}:${self.config.port} with ${path} and ${JSON.stringify(args)}`
				)
			},
		},
	}
	return actions
}

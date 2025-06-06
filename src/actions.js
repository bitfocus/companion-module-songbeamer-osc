import { Regex } from '@companion-module/base'
import { presentation_states } from './choices.js'

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
					choices: presentation_states.map((item, index) => ({
						id: String(index),
						label: item,
					})),
					isVisible: (options) => options.should_change,
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
					args = [
						{
							type: 's',
							value: presentation_states[presentation_state],
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
			subscribe: () => {
				osc.send({
					address: '/presentation/state',
					args: [],
				})
			},
		},
		presentation_permanentblack: {
			name: 'Change presentation state to permanent black',
			options: [
				{
					type: 'checkbox',
					label: 'Presentation should be permanent black',
					id: 'presentation_permanentblack',
					default: 'true',
					tooltip: 'Choose to enable permanent black',
					isVisible: (options) => options.should_change,
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
				const presentation_permanentblack = await self.parseVariablesInString(event.options.presentation_permanentblack)
				const should_change = await self.parseVariablesInString(event.options.should_change)

				self.log('debug', `permbalck:shouldchange= ${presentation_permanentblack}:${should_change}`)

				path = '/presentation/permanentblack'

				if (should_change == 'true') {
					if (presentation_permanentblack == 'true') {
						args = [
							{
								type: 'i',
								value: 1,
							},
						]
					} else {
						args = [
							{
								type: 'i',
								value: 0,
							},
						]
					}
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
			subscribe: () => {
				osc.send({
					address: '/presentation/permanentblack',
					args: [],
				})
			},
		},
		presentation_pagecount: {
			name: 'Get presentation page total',
			options: [],
			callback: async () => {
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
		stage_message_text: {
			name: 'Change stage message text',
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'stage_message_text',
					default: '',
					tooltip: 'Type any message to display',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
			],
			callback: async (event) => {
				let stage_message_text = await self.parseVariablesInString(event.options.stage_message_text)
				path = '/stage/message/text'
				args = [
					{
						type: 's',
						value: stage_message_text,
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
		stage_layoutname: {
			name: 'Change stage layout by name',
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'stage_layoutname',
					default: 'StageMonitor',
					tooltip: 'Type name of layout without extension to be used for stage display',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
			],
			callback: async (event) => {
				let stage_layoutname = await self.parseVariablesInString(event.options.stage_layoutname)
				path = '/stage/layoutname'
				args = [
					{
						type: 's',
						value: stage_layoutname,
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
		stage_timerinit: {
			name: 'Set stagetimer initial value',
			options: [
				{
					type: 'textinput',
					label: 'Set Timer target time',
					id: 'stage_timerinit_time',
					default: '11:45:00',
					tooltip: 'Chose any 24h time',
					regex: '^(0*[0-9]|1[0-9]|2[0-4]):(0*[0-9]|[1-5][0-9]|60):(0*[0-9]|[1-5][0-9]|60)$',
					useVariables: true,
					isVisible: (options) => !options.use_timeframe,
				},
				{
					type: 'textinput',
					label: 'Set length of timer in seconds',
					id: 'stage_timerinit_seconds',
					required: true,
					tooltip: 'The length of the timer to set as seconds',
					default: 60,
					regex: Regex.SIGNED_FLOAT,
					useVariables: true,
					isVisible: (options) => options.use_timeframe,
				},
				{
					type: 'checkbox',
					label: 'stage layout uses timeframe instead of time',
					id: 'use_timeframe',
					default: 'true',
					tooltip: 'disable in order to send target time instead of timeframe',
				},
			],
			callback: async (event) => {
				let use_timeframe = await self.parseVariablesInString(event.options.use_timeframe)

				let stage_timerinit = 0
				if (use_timeframe == 'true') {
					stage_timerinit = await self.parseVariablesInString(event.options.stage_timerinit_seconds)
					args = [
						{
							type: 'f',
							value: parseFloat(stage_timerinit) / 24 / 60 / 60,
						},
					]
				} else {
					stage_timerinit = await self.parseVariablesInString(event.options.stage_timerinit_time)
					args = [
						{
							type: 's',
							value: stage_timerinit,
						},
					]
				}

				path = '/stage/timerinit'

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
			name: 'Navigation within presentation and playlist',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'navigate_to',
					default: '0',
					tooltip:
						'Choose navigation action to be executed on presentation or playlist, disabling execute will query the item instead',
					choices: [
						{ id: 'nextpage', label: 'next page' },
						{ id: 'prevpage', label: 'prev page' },
						{ id: 'playlist/next', label: 'next playlist item' },
						{ id: 'playlist/previous', label: 'previous playlist item' },
						{ id: 'playlist/item', label: 'navigate to playlist item' },
						{ id: 'presentation/page', label: 'navigate to presentation page' },
						{ id: 'presentation/pagecaption', label: 'navigate to pagecaption' },
					],
					minChoicesForSearch: 0,
				},
				{
					type: 'textinput',
					label: 'Playlist / Page number',
					id: 'number',
					default: '1',
					isVisible: (options) => ['playlist/item', 'presentation/page'].contains(options.navigate_to),
					tooltip: 'Number of the page or playlist item (starting with 1 not 0 index!)',
					regex: Regex.SIGNED_NUMBER,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'page caption',
					id: 'presentation_pagecaption',
					default: 'Verse 1',
					isVisible: (options) => options.navigate_to == 'presentation/pagecaption',
					tooltip: 'Choose any verse marker as listed defined in your current song - e.g. Verse 1, Chorus 1 ... ',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Execute change',
					id: 'should_change',
					default: true,
					isVisible: (options) =>
						['nextpage', 'prevpage', 'playlist/previous', 'playlist/next'].includes(options.navigate_to),
					tooltip: 'disable in order to request state instead of changing it',
				},
			],
			callback: async (event) => {
				const navigate_to = await self.parseVariablesInString(event.options.navigate_to)
				const should_change = await self.parseVariablesInString(event.options.should_change) // TODO #11 - read bool not str?
				switch (navigate_to) {
					case 'nextpage':
						path = '/presentation/nextpage'
						break
					case 'prevpage':
						path = '/presentation/prevpage'
						break
					case 'playlist/next':
						path = '/playlist/next'
						break
					case 'playlist/previous':
						path = '/playlist/previous'
						break
					case 'playlist/item':
						path = '/playlist/itemindex'
						args = [
							{
								type: 'i',
								value: parseInt(await self.parseVariablesInString(event.options.number)) - 1,
							},
						]
						break
					case 'presentation/page':
						path = '/presentation/page'
						args = [
							{
								type: 'i',
								value: parseInt(await self.parseVariablesInString(event.options.number)),
							},
						]
						break
					case 'presentation/pagecaption':
						path = '/presentation/pagecaption'
						self.log('warn', 'This endpoint is not correctly implemented in Songbeamer! #15') // TODO #15
						args = [
							{
								type: 's',
								value: await self.parseVariablesInString(event.options.presentation_pagecaption),
							},
						]
						break
					default:
						self.log('debug', 'navigate_to option not recognized', navigate_to)
						break
				}

				//append execution indicator for relative actions
				if (['nextpage', 'prevpage', 'playlist/previous', 'playlist/next'].includes(navigate_to)) {
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
			},
		},
		playlist_count: {
			name: 'Get playlist page total',
			options: [],
			callback: async () => {
				path = '/playlist/count'
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
					isVisible: (options) => options.should_change,
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
				let video_state = await self.parseVariablesInString(event.options.video_state)
				const should_change = await self.parseVariablesInString(event.options.should_change)
				path = '/video/state'
				if (should_change == 'true') {
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
		video_position: {
			name: 'Move to video position',
			options: [
				{
					type: 'textinput',
					label: 'Position in seconds',
					id: 'video_position',
					required: true,
					tooltip: 'Position of video to skip to as seconds',
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
						value: parseFloat(video_position) / 24 / 60 / 60,
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
					isVisible: (options) => options.should_change,
				},
				{
					type: 'checkbox',
					label: 'Execute change',
					id: 'should_change',
					default: true,
					tooltip: 'disable in order to request state instead of changing it',
				},
			],
			callback: async (event) => {
				let livevideo_state = await self.parseVariablesInString(event.options.livevideo_state)
				const should_change = await self.parseVariablesInString(event.options.should_change)

				path = '/livevideo/state'
				if (should_change == 'true') {
					args = [
						{
							type: 's',
							value: livevideo_state === 'true' ? 'play' : 'stop',
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
				self.log(
					'warn',
					'Implementation of livevideo might not work with Songbeamer 6.04c see https://github.com/bitfocus/companion-module-songbeamer-osc/issues/18'
				)
			},
		},
		send_int: {
			name: 'Send integer',
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
					id: 'int',
					default: 1,
					regex: Regex.SIGNED_NUMBER,
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

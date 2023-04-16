const { InstanceBase, Regex, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const OSC = require('osc')

class SongbeamerInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	/**
	 * This is a method that initializes the instance for companion
	 * it needds to set status after successful execution
	 */
	async init(config) {
		this.config = config
		this.osc_server_init()

		this.log('debug', 'Starting definition of actions feedbacks and variables')
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariables()

		this.updateStatus('ok')
	}

	/**
	 * When module gets deleted
	 */
	async destroy() {
		this.log('debug', 'destroy method started')
		this.osc.close()
		this.log('debug', 'osc closed')
		delete this.osc
		this.log('debug', 'this.osc deleted')
		this.log('debug', 'destroy')
	}

	/**
	 * This is a method is executed on config changes
	 * It will restart the OSC server if it's configuration changed
	 */
	async configUpdated(config) {
		this.config = config
		if (this.config.port != this.osc.options.localPort || this.config.host != this.osc.remoteAddress) {
			this.log('debug', 'host or port configuration changed - reloading osc server')
			this.osc_server_init()
		}
	}

	/**
	 * Return config fields for web config
	 */
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: this.REGEX_IP,
				useVariables: true,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: this.REGEX_PORT,
				useVariables: true,
			},
		]
	}

	/**
	 * Defines the actions and respective options available with this module
	 */
	updateActions() {
		let path
		let args = []

		this.setActionDefinitions({
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
					path = await this.parseVariablesInString(event.options.path)

					this.osc.send({
						address: path,
						args: [],
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
				],
				callback: async (event) => {
					const presentation_state = await this.parseVariablesInString(event.options.presentation_state)
					path = '/presentation/state'
					const states = ['black', 'background', 'page', 'logo']

					args = [
						{
							type: 's',
							value: states[presentation_state],
						},
					]

					//TODO #7 Remove following line as workaround once fixed
					this.setVariableValues({ presentation_state: states[presentation_state] }) // TODO #11 check if changes required with conversion
					this.checkFeedbacks('presentation_state') // TODO #11 check if changes required with conversion

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			presentation_page: {
				name: 'Change presentation page',
				options: [
					{
						type: 'textinput',
						label: 'Page number',
						id: 'presentation_page',
						default: '1',
						tooltip: 'Choose any page number',
						regex: this.REGEX_NUMBER,
						useVariables: true,
					},
				],
				callback: async (event) => {
					const presentation_page = await this.parseVariablesInString(event.options.presentation_page)
					path = '/presentation/page'
					args = [
						{
							type: 'i',
							value: parseInt(presentation_page),
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
						regex: this.REGEX_SOMETHING,
						useVariables: true,
					},
				],
				callback: async (event) => {
					const presentation_versemarker = await this.parseVariablesInString(event.options.presentation_versemarker)
					;(path = '/presentation/pagecaption'),
						(args = [
							{
								type: 's',
								value: presentation_versemarker,
							},
						])

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			presentation_language_primary: {
				//TODO #6 Merge presentation_language actions
				name: 'Change primary language ID',
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
				],
				callback: async (event) => {
					const presentation_language_primary = await this.parseVariablesInString(
						event.options.presentation_language_primary
					)
					path = '/presentation/primarylanguage'
					args = [
						{
							type: 'i',
							value: parseInt(presentation_language_primary),
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			presentation_language: {
				//TODO #6 Merge presentation_language actions
				name: 'Change languages to be displayed',
				options: [
					{
						type: 'textinput',
						label: 'Combination of id-number of languages to be displayed',
						id: 'presentation_language',
						default: '1234',
						tooltip: 'Choose any combination of 1234', //TODO check why not displayed
						regex: this.REGEX_SOMETHING,
						useVariables: true,
					},
				],
				callback: async (event) => {
					let presentation_language = await this.parseVariablesInString(event.options.presentation_language)
					path = '/presentation/language'
					args = [
						{
							type: 's',
							value: presentation_language,
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			presentation_message_text: {
				//TODO #2 Combine with visible
				name: 'Change presentation message text',
				options: [
					{
						type: 'textinput',
						label: 'Message',
						id: 'presentation_message_text',
						default: '',
						tooltip: 'Type any message to display',
						regex: this.REGEX_SOMETHING,
						useVariables: true,
					},
				],
				callback: async (event) => {
					let presentation_message_text = await this.parseVariablesInString(event.options.presentation_message_text)
					path = '/presentation/message/text'
					args = [
						{
							type: 's',
							value: presentation_message_text,
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			presentation_message_visible: {
				//TODO #2 Combine with text
				name: 'Change presentation message visibility',
				options: [
					{
						type: 'checkbox',
						label: 'Show Message',
						id: 'presentation_message_visible',
						default: true,
					},
				],
				callback: async (event) => {
					let presentation_message_visible = await this.parseVariablesInString(
						event.options.presentation_message_visible
					)
					path = '/presentation/message/visible'
					args = [
						{
							type: 'i',
							value: presentation_message_visible === 'true' ? 1 : 0,
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			navigate_to: {
				//TODO #3 Merge presentation_versemarker into navigate_to
				name: 'Navigation options within presentation ',
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
						],
						minChoicesForSearch: 0,
					},
					{
						type: 'checkbox',
						label: 'Execute',
						id: 'navigate_to_execute',
						default: true,
					},
				],
				callback: async (event) => {
					const navigate_to = await this.parseVariablesInString(event.options.navigate_to)
					const navigate_to_execute = await this.parseVariablesInString(event.options.navigate_to_execute) // TODO #11 - read bool not str?
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
						default:
							this.log('debug', 'navigate_to option not recognized', navigate_to)
							break
					}
					args = [
						{
							type: 'i',
							value: navigate_to_execute === 'true' ? 1 : 0,
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			//TODO improve by integrating into navigate_to with optionally displayed param
			navigate_to_playlistitem: {
				name: 'Navigate to a numbered item within the playlist ',
				options: [
					{
						type: 'textinput',
						label: 'Playlist item number',
						id: 'navigate_to_playlistitem',
						tooltip: 'Frist playlist entry is 0!',
						default: 1,
						regex: this.REGEX_SIGNED_NUMBER,
						useVariables: true,
					},
				],
				callback: async (event) => {
					let navigate_to_playlistitem = await this.parseVariablesInString(event.options.navigate_to_playlistitem)
					path = '/playlist/itemindex'
					args = [
						{
							type: 'i',
							value: parseInt(navigate_to_playlistitem),
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
						minChoicesForSearch: 0,
					},
				],
				callback: async (event) => {
					let video_state = await this.parseVariablesInString(event.options.video_state)
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
							this.log('debug', 'video state not recoginzed ', video_state)
							break
					}

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
			video_position: {
				name: 'Move to video position',
				options: [
					{
						type: 'textinput',
						label: 'Position in h',
						id: 'video_position',
						required: true,
						tooltip: 'Position of video to skip to as hours with . as decimal',
						default: 1,
						regex: this.REGEX_SIGNED_FLOAT,
						useVariables: true,
					},
				],
				callback: async (event) => {
					let video_position = await this.parseVariablesInString(event.options.video_position)
					path = '/video/position'
					args = [
						{
							type: 'f',
							value: parseFloat(video_position),
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
					let livevideo_state = await this.parseVariablesInString(event.options.livevideo_state)
					path = '/livevideo/state'
					args = [
						{
							type: 's',
							value: livevideo_state === 'true' ? 'play' : 'stop',
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
						regex: this.REGEX_SIGNED_NUMBER,
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
					let int = await this.parseVariablesInString(event.options.int)
					path = await this.parseVariablesInString(event.options.path)
					args = [
						{
							type: 'i',
							value: parseInt(int),
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
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
					let string = await this.parseVariablesInString(event.options.string)
					path = await this.parseVariablesInString(event.options.path)
					args = [
						{
							type: 's',
							value: `${string}`,
						},
					]

					this.osc.send({
						address: path,
						args: args,
					})
					this.log(
						'debug',
						`Sent OSC to ${this.config.host}:${this.config.port} with ${path} and ${JSON.stringify(args)}`
					)
				},
			},
		})
		this.log('debug', 'Finished updateActions()')
	}

	/**
	 * Method which sets the feedback definitions
	 */
	updateFeedbacks() {
		this.setFeedbackDefinitions({
			presentation_state: {
				type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
				name: 'Presentation State',
				description: 'Checks presentation state',
				defaultStyle: {}, //TODO #4 Implement default style
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
				callback: async (event) => {
					let var_state
					this.getVariableValue('presentation_state', (value) => {
						var_state = value
					})
					const states = ['black', 'background', 'page', 'logo']
					if (var_state == states[event.options.presentation_state]) {
						return true
					} else {
						return false
					}
				},
			},
		})
		this.log('debug', 'Finished updateFeedbacks()')
	}

	/**
	 * Method which sets the variable definitions
	 */
	updateVariables() {
		this.setVariableDefinitions([
			{
				name: 'Presentation State',
				variableId: 'presentation_state',
			},
		])
		this.setVariableValues({ presentation_state: 'Not Checked' })
		this.log('debug', 'Finished updateVariables()')
	}

	/**
	 * Initialisation method for the OSC server used to send and receive messages
	 */
	osc_server_init() {
		this.log('debug', 'osc_server_init method started')
		if (this.osc) {
			try {
				this.osc.close()
				delete this.osc
			} catch (e) {
				// Ignore
			}
		}
		/**
		 * Create an osc.js UDP Port listening on port defined in config.
		 * */
		this.osc = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			remoteAddress: this.config.host,
			localPort: this.config.port,
			remotePort: this.config.port,
			broadcast: true,
			metadata: true,
		})

		/**
		 * Listener to receive messages
		 */
		this.osc.on('message', (oscMsg, timeTag, info) => {
			this.log('debug', `Received OSC message, Remote info is: ${info}`)

			const message = oscMsg['address']
			const args = oscMsg['args'][0]
			const value = oscMsg['args'][0]['value']

			this.log('debug', `Received OSC ${message} ${JSON.stringify(args)} ${value}`)

			switch (message) {
				case '/presentation/pagecount':
					this.log('debug', `/presentation/pagecount ${value}`)
					break
				case '/presentation/filename':
					this.log('debug', `/presentation/filename ${value}`)
					break
				case '/playlist/filename':
					this.log('debug', `/playlist/filename ${value}`)
					break
				case '/playlist/count':
					this.log('debug', `/playlist/count ${value}`)
					break
				case '/video/length':
					this.log('debug', `/video/length ${value}`)
					break
				case '/video/filename':
					this.log('debug', `/video/filename ${value}`)
					break
				case '/presentation/state':
					this.log('debug', `presentation/state ${value}`)
					const states = ['black', 'background', 'page', 'logo']
					this.setVariableValues({ presentation_state: states[value] })
					this.checkFeedbacks('presentation_state')
					break
				default:
					this.log('warning', `unknown osc message case ${oscMsg}`)
					//TODO
					// /playlist/items/**/caption
					// /playlist/items/**/filename
					break
			}
		})

		/**
		 * Listener logging ready function
		 */
		this.osc.on('ready', () => {
			this.log('info', 'OSC port is in "ready" state')
		})

		// Open the socket.
		this.osc.open()

		this.log('debug', 'osc_server_init method finished ${this.osc}')
	}
}

runEntrypoint(SongbeamerInstance, UpgradeScripts)

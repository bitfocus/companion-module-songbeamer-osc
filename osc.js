const { InstanceBase, Regex, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const OSC = require('@osc')

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

		this.actions()
		this.feedbacks()
		this.variables()
		//TODO #1 Initialise variables
		this.setVariable('presentation_state', 'Not Checked')

		this.updateStatus('ok')
	}

	/**
	 * When module gets deleted
	 */
	async destroy() {
		this.osc.close()
		delete this.osc
		this.log('debug','destroy')
	}

	/**
	 * This is a method is executed on config changes
	 * It will restart the OSC server if it's configuration changed
	 */
	async configUpdated(config) {
		this.config = config
		if (this.config.port != this.osc.options.localPort || this.config.host != this.osc.remoteAddress) {
			this.log('debug','host or port configuration changed - reloading osc server')
			this.osc_server_init()
		}
	}


	/**
	 * Return config fields for web config
	 */
	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: this.REGEX_PORT,
			},
		]
	}

	/**
	 * Defines the actions and respective options available with this module
	 */
	actions(system) {
		this.setActions({
			send_blank: {
				label: 'Send message without arguments',
				options: [
					{
						type: 'textwithvariables',
						label: 'OSC Path',
						id: 'path',
						default: '/osc/path',
					},
				],
			},
			presentation_state: {
				label: 'Change presentation state',
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
			},
			presentation_page: {
				label: 'Change presentation page',
				options: [
					{
						type: 'textinput',
						label: 'Page number',
						id: 'presentation_page',
						default: '1',
						tooltip: 'Choose any page number',
						regex: this.REGEX_NUMBER,
					},
				],
			},
			presentation_versemarker: {
				//TODO #3 Merge presentation_versemarker into navigate_to
				label: 'Change presentation page to verse marker',
				options: [
					{
						type: 'textinput',
						label: 'Verse marker',
						id: 'presentation_versemarker',
						default: 'Verse 1',
						tooltip: 'Choose any verse marker',
						regex: this.REGEX_SOMETHING,
					},
				],
			},
			presentation_language_primary: {
				//TODO #6 Merge presentation_language actions
				label: 'Change primary language ID',
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
			},
			presentation_language: {
				//TODO #6 Merge presentation_language actions
				label: 'Change languages to be displayed',
				options: [
					{
						type: 'textinput',
						label: 'Combination of id-number of languages to be displayed',
						id: 'presentation_language',
						default: '1234',
						tooltip: 'Choose any combination of 1234', //TODO check why not displayed
						regex: this.REGEX_SOMETHING,
					},
				],
			},
			presentation_message_text: {
				//TODO #2 Combine with visible
				label: 'Change presentation message text',
				options: [
					{
						type: 'textinput',
						label: 'Message',
						id: 'presentation_message_text',
						default: '',
						tooltip: 'Type any message to display',
						regex: this.REGEX_SOMETHING,
					},
				],
			},
			presentation_message_visible: {
				//TODO #2 Combine with text
				label: 'Change presentation message visibility',
				options: [
					{
						type: 'checkbox',
						label: 'Show Message',
						id: 'presentation_message_visible',
						default: true,
					},
				],
			},
			navigate_to: {
				//TODO #3 Merge presentation_versemarker into navigate_to
				label: 'Navigation options within presentation ',
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
			},
			navigate_to_playlistitem: {
				label: 'Navigate to a numbered item within the playlist ',
				options: [
					{
						type: 'textwithvariables',
						label: 'Playlist item number',
						id: 'navigate_to_playlistitem',
						tooltip: 'Frist playlist entry is 0!',
						default: 1,
						regex: this.REGEX_SIGNED_NUMBER,
					},
				],
			},
			video_state: {
				label: 'Change video state',
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
			},
			video_position: {
				label: 'Move to video position',
				options: [
					{
						type: 'textwithvariables',
						label: 'Position in h',
						id: 'video_position',
						required: true,
						tooltip: 'Position of video to skip to as hours with . as decimal',
						default: 1,
						regex: this.REGEX_SIGNED_FLOAT,
					},
				],
			},
			livevideo_state: {
				label: 'Change livevideo state',
				options: [
					{
						type: 'checkbox',
						label: 'Play',
						id: 'livevideo_state',
						default: true,
					},
				],
			},
			send_int: {
				label: 'Send integer',
				options: [
					{
						type: 'textwithvariables',
						label: 'OSC Path',
						id: 'path',
						default: '/osc/path',
					},
					{
						type: 'textwithvariables',
						label: 'Value',
						id: 'int',
						default: 1,
						regex: this.REGEX_SIGNED_NUMBER,
					},
				],
			},
			send_string: {
				label: 'Send string',
				options: [
					{
						type: 'textwithvariables',
						label: 'OSC Path',
						id: 'path',
						default: '/osc/path',
					},
					{
						type: 'textwithvariables',
						label: 'Value',
						id: 'string',
						default: 'text',
					},
				],
			},
		})
	}

	/**
	 * Method which is used to execute something based on the actions defined before
	 * by default args and path is set based on the action and sent after the switch case using the osc server from init
	 * @param action - The companion action object which was executed
	 */
	action(action) {
		let path
		let args = null

		switch (action.action) {
			case 'send_blank':
				this.system.emit('variable_parse', action.options.path, (value) => {
					path = value
				})
				args = []
				break
			case 'presentation_state':
				let presentation_state
				this.system.emit('variable_parse', action.options.presentation_state, (value) => {
					presentation_state = value
				})
				path = '/presentation/state'
				const states = ['black', 'background', 'page', 'logo']
				args = [
					{
						type: 's',
						value: states[presentation_state],
					},
				]
				//TODO #7 Remove following line as workaround once fixed
				this.setVariable('presentation_state', states[presentation_state])
				this.checkFeedbacks('presentation_state')
				break
			case 'presentation_page':
				let presentation_page
				this.system.emit('variable_parse', action.options.presentation_page, (value) => {
					presentation_page = value
				})
				path = '/presentation/page'
				args = [
					{
						type: 'i',
						value: parseInt(presentation_page),
					},
				]
				break
			case 'presentation_versemarker': //TODO #3 Merge presentation_versemarker into navigate_to
				let presentation_versemarker
				this.system.emit('variable_parse', action.options.presentation_versemarker, (value) => {
					presentation_versemarker = value
				})
				path = '/presentation/pagecaption'
				args = [
					{
						type: 's',
						value: presentation_versemarker,
					},
				]
				break
			case 'presentation_language_primary': //TODO #6 Merge presentation_language actions
				let presentation_language_primary
				this.system.emit('variable_parse', action.options.presentation_language_primary, (value) => {
					presentation_language_primary = value
				})
				path = '/presentation/primarylanguage'
				args = [
					{
						type: 'i',
						value: parseInt(presentation_language_primary),
					},
				]
				break
			case 'presentation_language': //TODO #6 Merge presentation_language actions
				let presentation_language
				this.system.emit('variable_parse', action.options.presentation_language, (value) => {
					presentation_language = value
				})
				path = '/presentation/language'
				args = [
					{
						type: 's',
						value: presentation_language,
					},
				]
				break
			case 'presentation_message_text': //TODO #2 Combine with visible
				let presentation_message_text
				this.system.emit('variable_parse', action.options.presentation_message_text, (value) => {
					presentation_message_text = value
				})
				path = '/presentation/message/text'
				args = [
					{
						type: 's',
						value: presentation_message_text,
					},
				]
				break
			case 'presentation_message_visible': //TODO #2 Combine with text
				let presentation_message_visible
				this.system.emit('variable_parse', action.options.presentation_message_visible, (value) => {
					presentation_message_visible = value
				})
				path = '/presentation/message/visible'
				args = [
					{
						type: 'i',
						value: presentation_message_visible === 'true' ? 1 : 0,
					},
				]
				break
			case 'navigate_to': //TODO #3 Merge presentation_versemarker into navigate_to
				let navigate_to
				let navigate_to_execute
				this.system.emit('variable_parse', action.options.navigate_to, (value) => {
					navigate_to = value
				})
				this.system.emit('variable_parse', action.options.navigate_to_execute, (value) => {
					navigate_to_execute = value
				})
				args = [
					{
						type: 'i',
						value: navigate_to_execute === 'true' ? 1 : 0,
					},
				]
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
						this.log('debug','navigate_to option not recognized', navigate_to)
						break
				}
				break
			case 'navigate_to_playlistitem': //TODO improve by integrating into navigate_to with optionally displayed param
				let navigate_to_playlistitem
				this.system.emit('variable_parse', action.options.navigate_to_playlistitem, (value) => {
					navigate_to_playlistitem = value
				})
				path = '/playlist/itemindex'
				args = [
					{
						type: 'i',
						value: parseInt(navigate_to_playlistitem),
					},
				]
				break
			case 'video_state':
				let video_state
				this.system.emit('variable_parse', action.options.video_state, (value) => {
					video_state = value
				})
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
						this.log('debug','video state not recoginzed ', video_state)
						break
				}
				break
			case 'video_position':
				let video_position
				this.system.emit('variable_parse', action.options.video_position, (value) => {
					video_position = value
				})
				path = '/video/position'
				args = [
					{
						type: 'f',
						value: parseFloat(video_position),
					},
				]
				break
			case 'livevideo_state':
				let livevideo_state
				this.system.emit('variable_parse', action.options.livevideo_state, (value) => {
					livevideo_state = value
				})
				path = '/livevideo/state'
				args = [
					{
						type: 's',
						value: livevideo_state === 'true' ? 'play' : 'stop',
					},
				]
				break
			case 'send_int':
				let int
				path = action.options.path
				this.system.emit('variable_parse', action.options.path, (value) => {
					path = value
				})
				this.system.emit('variable_parse', action.options.int, (value) => {
					int = value
				})
				args = [
					{
						type: 'i',
						value: parseInt(int),
					},
				]
				break
			case 'send_string':
				let string
				path = action.options.path
				this.system.emit('variable_parse', action.options.path, (value) => {
					path = value
				})
				this.system.emit('variable_parse', action.options.string, (value) => {
					string = value
				})
				args = [
					{
						type: 's',
						value: '${string}',
					},
				]
				break
			default:
				this.log('debug','action: ', action)
				break
		}

		if (args !== null) {
			this.osc.send({
				address: path,
				args: args,
			})
			this.log('debug','Sent OSC', this.config.host, this.config.port, path, args)
		}
	}

	/**
	 * Method which sets the feedback definitions
	 * @param system - Unknown default param from template
	 */
	feedbacks(system) {
		this.setFeedbackDefinitions({
			presentation_state: {
				type: 'boolean', // Feedbacks can either a simple boolean, or can be an 'advanced' style change (until recently, all feedbacks were 'advanced')
				label: 'Presentation State',
				description: 'Checks presentation state',
				style: {}, //TODO #4 Implement default style
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
			},
		})
	}

	/**
	 * Method which is used to run feedbacks something based on the actions defined before
	 * @param event - The companion event which triggered the feedback
	 */
	feedback(event) {
		if (event.type == 'presentation_state') {
			let var_state
			this.getVariable('presentation_state', (value) => {
				var_state = value
			})
			const states = ['black', 'background', 'page', 'logo']
			if (var_state == states[event.options.presentation_state]) {
				return true
			} else {
				return false
			}
		} else {
			this.log('debug','feedback event not recognized', event)
			false
		}
		return false
	}

	/**
	 * Method which sets the variable definitions
	 * @param system - Unknown default param from template
	 */
	variables(system) {
		this.setVariableDefinitions({
			label: 'Presentation State',
			name: 'presentation_state',
		})
	}

	/**
	 * Initialisation method for the OSC server used to send and receive messages
	 */
	osc_server_init() {
		this.log('debug','osc_server_init method started')
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
			//this.log('debug','Received OSC message, Remote info is: ', info)
			message = oscMsg['address']
			args = oscMsg['args'][0]
			value = oscMsg['args'][0]['value']
			//this.log('debug','oscMsg:', message, args, value)

			switch (message) {
				case '/presentation/pagecount':
					this.log('debug','/presentation/pagecount', value)
					break
				case '/presentation/filename':
					this.log('debug','/presentation/filename', value)
					break
				case '/playlist/filename':
					this.log('debug','/playlist/filename', value)
					break
				case '/playlist/count':
					this.log('debug','/playlist/count', value)
					break
				case '/video/length':
					this.log('debug','/video/length', value)
					break
				case '/video/filename':
					this.log('debug','/video/filename', value)
					break
				case '/presentation/state':
					const states = ['black', 'background', 'page', 'logo']
					this.setVariable('presentation_state', states[value])
					this.checkFeedbacks('presentation_state')
					break
				default:
					this.log('debug','unknown osc message case', oscMsg)
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
			this.log('debug','OSC port is ready')
		})

		// Open the socket.
		this.osc.open()

		this.log('debug','osc_server_init method finished', this.osc)
	}
}

runEntrypoint(SongbeamerInstance, UpgradeScripts)

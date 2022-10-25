var instance_skel = require('../../instance_skel')
var GetUpgradeScripts = require('./upgrades')
var OSC = require('osc')

function instance(system, id, config) {
	var self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	self.actions() // export actions

	return self
}

instance.GetUpgradeScripts = GetUpgradeScripts

instance.prototype.updateConfig = function (config) {
	var self = this
	self.config = config
}
instance.prototype.init = function () {
	var self = this
	self.debug('instance prototype init pre osc')
	self.debug('var set')
	self.osc = self.osc_server_init()
	self.debug('instance prototype init post osc')
	self.status(self.STATE_OK)
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this
	self.debug('destroy')
}

instance.prototype.actions = function (system) {
	var self = this
	self.setActions({
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
					regex: self.REGEX_NUMBER,
				},
			],
		},
		presentation_versemarker: {
			label: 'Change presentation page to verse marker',
			options: [
				{
					type: 'textinput',
					label: 'Verse marker',
					id: 'presentation_versemarker',
					default: 'Verse 1',
					tooltip: 'Choose any verse marker',
					regex: self.REGEX_SOMETHING,
				},
			],
		},
		presentation_language_primary: {
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
			label: 'Change languages to be displayed',
			options: [
				{
					type: 'textinput',
					label: 'Combination of id-number of languages to be displayed',
					id: 'presentation_language',
					default: '1234',
					tooltip: 'Choose any combination of 1234', //TODO check why not displayed
					regex: self.REGEX_SOMETHING,
				},
			],
		},
		presentation_message_text: {
			label: 'Change presentation message text',
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'presentation_message_text',
					default: '',
					tooltip: 'Type any message to display',
					regex: self.REGEX_SOMETHING,
				},
			],
		},
		presentation_message_visible: {
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
					regex: self.REGEX_SIGNED_NUMBER,
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
					tooltip: 'Position of video to skip to as hours with . as decimal',
					default: 1,
					regex: self.REGEX_SIGNED_FLOAT,
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
					regex: self.REGEX_SIGNED_NUMBER,
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

instance.prototype.action = function (action) {
	var self = this

	var path
	var args = null

	//self.debug('action: ', action);

	switch (action.action) {
		case 'send_blank':
			self.system.emit('variable_parse', action.options.path, function (value) {
				path = value
			})
			args = []
			break
		case 'presentation_state':
			self.system.emit('variable_parse', action.options.presentation_state, function (value) {
				presentation_state = value
			})
			path = '/presentation/state'
			switch (presentation_state) {
				case '0':
					args = [
						{
							type: 's',
							value: 'black',
						},
					]
					break
				case '1':
					args = [
						{
							type: 's',
							value: 'background',
						},
					]
					break
				case '2':
					args = [
						{
							type: 's',
							value: 'page',
						},
					]
					break
				case '3':
					args = [
						{
							type: 's',
							value: 'logo',
						},
					]
					break
				default:
					self.debug('presentation state not recoginzed ', presentation_state)
					break
			}
			break
		case 'presentation_page':
			self.system.emit('variable_parse', action.options.presentation_page, function (value) {
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
		case 'presentation_versemarker':
			self.system.emit('variable_parse', action.options.presentation_versemarker, function (value) {
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
		case 'presentation_language_primary': //TODO merge with presentation language
			self.system.emit('variable_parse', action.options.presentation_language_primary, function (value) {
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
		case 'presentation_language':
			self.system.emit('variable_parse', action.options.presentation_language, function (value) {
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
		case 'presentation_message_text':
			self.system.emit('variable_parse', action.options.presentation_message_text, function (value) {
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
		case 'presentation_message_visible':
			self.system.emit('variable_parse', action.options.presentation_message_visible, function (value) {
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
		case 'navigate_to':
			self.system.emit('variable_parse', action.options.navigate_to, function (value) {
				navigate_to = value
			})
			self.system.emit('variable_parse', action.options.navigate_to_execute, function (value) {
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
					self.debug('navigate_to option not recognized', navigate_to)
					break
			}
			break
		case 'navigate_to_playlistitem': //TODO improve by integrating into navigate_to with optionally displayed param
			self.system.emit('variable_parse', action.options.navigate_to_playlistitem, function (value) {
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
			self.system.emit('variable_parse', action.options.video_state, function (value) {
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
					self.debug('video state not recoginzed ', video_state)
					break
			}
			break
		case 'video_position':
			var float
			self.system.emit('variable_parse', action.options.video_position, function (value) {
				video_position = value
			})
			args = [
				{
					type: 'f',
					value: parseFloat(video_position),
				},
			]
			break
		case 'livevideo_state':
			self.system.emit('variable_parse', action.options.livevideo_state, function (value) {
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
			var int
			path = action.options.path
			self.system.emit('variable_parse', action.options.path, function (value) {
				path = value
			})
			self.system.emit('variable_parse', action.options.int, function (value) {
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
			var string
			path = action.options.path
			self.system.emit('variable_parse', action.options.path, function (value) {
				path = value
			})
			self.system.emit('variable_parse', action.options.string, function (value) {
				string = value
			})
			args = [
				{
					type: 's',
					value: '' + string,
				},
			]
			break
		default:
			break
	}

	if (args !== null) {
		self.osc.send({
			address: path,
			args: args,
		})
		self.debug('Sent OSC', self.config.host, self.config.port, path, args)
	}
}

instance.prototype.osc_server_init = function () {
	var self = this
	self.debug('osc_server_init method started')
	if (self.osc) {
		try {
			self.osc.close()
		} catch (e) {
			// Ignore
		}
	}
	// Create an osc.js UDP Port listening on port 57121.
	self.osc = new OSC.UDPPort({
		localAddress: '0.0.0.0',
		remoteAddress: self.config.host,
		localPort: self.config.port, // 0, random
		remotePort: self.config.port,
		broadcast: true,
		metadata: true,
	})

	// Listen for incoming OSC messages.
	self.osc.on('message', function (oscMsg, timeTag, info) {
		//self.debug('Received OSC message, Remote info is: ', info) //TODO call feedback action
		message = oscMsg['address']
		args = oscMsg['args'][0]
		value = oscMsg['args'][0]['value']
		//self.debug('oscMsg:', message, args, value)

		switch (message) {
			case '/presentation/pagecount':
				self.debug('/presentation/pagecount', value)
				break
			case '/presentation/filename':
				self.debug('/presentation/filename', value)
				break
			case '/playlist/filename':
				self.debug('/playlist/filename', value)
				break
			case '/playlist/count':
				self.debug('/playlist/count', value)
				break
			case '/video/length':
				self.debug('/video/length', value)
				break
			case '/video/filename':
				self.debug('/video/filename', value)
				break
			default:
				self.debug('unknown osc message case', oscMsg)
				//TODO
				// /playlist/items/**/caption
				// /playlist/items/**/filename

				break
		}
	})

	self.osc.on('ready', function () {
		self.debug('OSC port is ready')
	})

	// Open the socket.
	self.osc.open()

	self.debug('osc_server_init method finished', self.osc)
	return self.osc
}

instance_skel.extendedBy(instance)
exports = module.exports = instance

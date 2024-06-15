import { InstanceBase, runEntrypoint } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import pkg from 'osc'
const OSC = pkg
import { presentation_states, video_states, livevideo_states } from './choices.js'

import { getActionDefinitions } from './actions.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getPresetDefinitions } from './presets.js'
import { variables } from './variables.js'

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
		this.updateStatus('connecting')
		this.osc_server_init()

		this.setActionDefinitions(getActionDefinitions(this, this.osc))
		this.log('debug', 'Finished updateActions()')

		this.setFeedbackDefinitions(getFeedbackDefinitions(this, this.osc))
		this.log('debug', 'Finished definition of feedbacks')

		this.setVariableDefinitions(variables)
		this.log('debug', 'Finished definition of variables')

		this.setPresetDefinitions(getPresetDefinitions(this))
		this.log('debug', 'Finished definition of presets')

		// xinfo is used to gather information about connection status and init variables
		this.osc.send({
			address: '/xinfo',
			args: [],
		})
		this.log('debug', 'xinfo requested as part of init')
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

		if (config.local_port == config.remote_port) {
			this.log('warn', 'remote and local port are the same - if running on the same machine this does not work!')
		}
		if (
			this.config.local_port != this.osc.options.localPort ||
			this.config.remote_port != this.osc.options.remotePort ||
			this.config.host != this.osc.remoteAddress
		) {
			this.log('debug', 'host or port configuration changed - reloading osc server')
			this.osc_server_init()
		}
	}

	/**
	 * request updates, subscription expires every 10 seconds
	 */
	osc_update_polling() {
		this.osc.send({
			address: '/xremote',
			args: [],
		})
		//this.log('debug', 'heartbeat send')
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
				tooltip: 'IP adress of the PC running Songbeamer',
				width: 8,
				regex: this.REGEX_IP,
				useVariables: true,
			},
			{
				type: 'textinput',
				id: 'remote_port',
				label: 'Target Port',
				tooltip: 'OSC Port used in Songbeamer default is 10023',
				width: 4,
				regex: this.REGEX_PORT,
				useVariables: true,
			},
			{
				type: 'textinput',
				id: 'local_port',
				label: 'Local Port',
				tooltip:
					'OSC Port used to send messages - should be different from target port to avoid mistakes when running on same machine',
				width: 4,
				regex: this.REGEX_PORT,
				useVariables: true,
			},
		]
	}

	/**
	 * Initialisation method for the OSC server used to send and receive messages
	 */
	osc_server_init() {
		var self = this
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
			localPort: this.config.local_port,
			remotePort: this.config.remote_port,
			broadcast: true,
			metadata: true,
		})

		/**
		 * Listener to receive messages
		 */
		this.osc.on('message', (oscMsg, timeTag, info) => {
			this.log('debug', `Received OSC message from: ${JSON.stringify(info)}`)
			this.log('debug', `OSC Content is: ${JSON.stringify(oscMsg)}`)

			const address = oscMsg['address']
			let args = oscMsg['args']
			let value = undefined

			if (args.length == 1) {
				args = args[0]
				value = args['value']
			}

			switch (address) {
				case '/xinfo':
					this.log('debug', `/xinfo ${JSON.stringify(args)}`)
					this.network_address = args[0]['value']
					this.network_name = args[1]['value']
					this.software = args[2]['value']
					this.software_version = args[3]['value']
					this.log(
						'info',
						`Connected to ${this.network_address} (${this.network_name}) on ${this.software} (${this.software_version})`
					)
					this.updateStatus('ok')

					// trying to init all variables
					this.log('info', 'triggering re-initialization of all variables')
					for (const variable of variables) {
						const init_url = `/${variable.variableId.split('_').join('/')}`
						this.log('debug', `triggering init for var ${variable.variableId} with ${init_url}`)
						this.osc.send({
							address: init_url,
							args: [],
						})
					}
					break
				case '/info':
					this.log('debug', `/xinfo ${JSON.stringify(args)}`)
					this.server_version = args[0]['value']
					this.server_name = args[1]['value']
					this.software = args[2]['value']
					this.software_version = args[3]['value']
					this.log(
						'info',
						`Connected to ${this.server_name} (${this.server_version}) on ${this.software} (${this.software_version})`
					)
					break
				case '/presentation/page':
					this.log('debug', `/presentation/page ${value}`)
					this.setVariableValues({ presentation_page: value })
					this.checkFeedbacks('presentation_page')
					this.log('info', `'presentation_page' changed to ${value}`)
					break
				case '/presentation/nextpage':
				case '/presentation/prevpage':
					this.log('debug', `/presentation/nextpage or /presentation/nextpage ${value}`)
					break
				case '/presentation/pagecount':
					this.log('debug', `/presentation/pagecount ${value}`)
					this.setVariableValues({ presentation_pagecount: value })
					this.checkFeedbacks('presentation_pagecount')
					this.log('info', `'presentation_pagecount' changed to ${value}`)
					break
				case '/presentation/filename':
					this.log('info', `'/presentation/filename ${value}`)
					value = value.split(/\\|\//)
					value = value[value.length - 1]
					value = value.split('.').slice(0, -1).join('.')
					this.setVariableValues({ presentation_filename: value })
					this.checkFeedbacks('presentation_filename')
					this.log('info', `'presentation_filename' changed to ${value}`)
					break
				case '/presentation/pagecaption':
					this.log('debug', `/presentation/pagecaption ${value}`)
					this.setVariableValues({ presentation_pagecaption: value })
					this.checkFeedbacks('presentation_pagecaption')
					this.log('info', `'presentation_pagecaption' changed to ${value}`)
					break
				case '/playlist/filename':
					this.log('info', `'/playlist/filename ${value}`)
					value = value.split(/\\|\//)
					value = value[value.length - 1]
					value = value.split('.').slice(0, -1).join('.')
					this.setVariableValues({ playlist_filename: value })
					this.checkFeedbacks('playlist_filename')
					this.log('info', `'playlist_filename' changed to ${value}`)
					break
				case '/playlist/itemindex':
					this.log('debug', `/playlist/itemindex ${value}`)
					this.setVariableValues({ playlist_itemindex: value + 1 })
					this.checkFeedbacks('playlist_itemindex')
					this.log('info', `'playlist_itemindex' changed to ${value}`)
					break
				case '/playlist/previous':
				case '/playlist/next':
					this.log('debug', `/playlist/previous or /playlist/next ${value}`)
					break
				case '/playlist/changed':
					this.log('debug', `/playlist/changed ${value}`)
					break
				case '/playlist/count':
					this.log('debug', `/playlist/count ${value}`)
					this.setVariableValues({ playlist_count: value })
					this.checkFeedbacks('playlist_count')
					this.log('info', `'playlist_count' changed to ${value}`)
					break
				case '/video/state':
					this.log('debug', `/video/state ${value}`)
					this.setVariableValues({ video_state: video_states[value] })
					this.checkFeedbacks('video_state', 'video_state_advanced')
					this.log('info', `'video_state' changed to ${video_states[value]}`)
					break
				case '/video/position':
					this.log('debug', `/video/position ${value}`) //in days! -> convert to minutes
					this.log(
						'warn',
						'There might be a bug in Songbeamer 6.0.4a which always returns the position set before instead of actual position #16'
					)
					break
				case '/video/length':
					this.log('debug', `/video/length ${value}`) //in days! -> convert to minutes
					this.log('warn', 'There might be a bug in Songbeamer 6.0.0d which always results in a 0 value #17')
					break
				case '/video/filename':
					this.log('warn', `/video/filename ${value}  not yet implemented`)
					break
				case '/presentation/state':
					this.log('debug', `presentation/state ${value}`)
					this.setVariableValues({ presentation_state: presentation_states[value] })
					this.checkFeedbacks('presentation_state', 'presentation_state_advanced')
					this.log('info', `'presentation_state' changed to ${presentation_states[value]}`)
					break
				case '/presentation/message/text':
					this.log('debug', `presentation/message/text ${value}`)
					this.setVariableValues({ presentation_message_text: value })
					this.checkFeedbacks('presentation_message_text')
					this.log('info', `'presentation_message_text' changed to ${value}`)
					break
				case '/presentation/message/visible':
					this.log('debug', `presentation/message/visible ${value}`)
					this.setVariableValues({ presentation_message_visible: value == 1 })
					this.checkFeedbacks('presentation_message_visible')
					this.log('info', `'presentation_message_visible' changed to ${value == 1}`)
					break
				case '/livevideo/state':
					this.log('debug', `/livevideo/state ${value}`)
					this.setVariableValues({ livevideo_state: livevideo_states[value] })
					this.checkFeedbacks('livevideo_state', 'livevideo_state_advanced')
					this.log('info', `'livevideo_state' changed to ${livevideo_states[value]}`)
					break
				case undefined:
					this.log('warn', `receveived a special message without address - not implemented`)
					break
				default:
					this.log('warn', `received a message with an unknown address - not implemented`)
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
			self.osc_update_polling()
			this.heartbeat = setInterval(function () {
				self.osc_update_polling()
			}, 9500) // just before 10 sec expiration

			// check /xinfo in order to confirm successful connection upon response
			this.osc.send({
				address: '/xinfo',
				args: [],
			})
			self.log('info', `Sent OSC to ${self.config.host}:${self.config.port} with /xinfo to check connection status`)
		})

		/**
		 * Properly closing the hearbeat on close
		 */
		this.osc.on('close', () => {
			if (this.heartbeat) {
				clearInterval(this.heartbeat)
				delete this.heartbeat
			}
		})

		/**
		 * Properly logging error and stopping heartbeat
		 */
		this.osc.on('error', (err) => {
			if (err.message.startsWith('send ENETUNREACH')) {
				this.log('error', 'Connection lost - will try to recover every 5 sec as long as module is active')
				this.updateStatus('Connecting')
			} else {
				this.log('error', 'Error: ' + err.message + ' module restart is reload is required!')
				this.updateStatus('UnknownError', err.message)
				if (this.heartbeat) {
					clearInterval(this.heartbeat)
					delete this.heartbeat
				}
			}
		})

		// Open the socket.
		this.osc.open()
		this.log('debug', `osc_server_init method finished ${JSON.stringify(this.osc)}`)
	}
}

runEntrypoint(SongbeamerInstance, UpgradeScripts)

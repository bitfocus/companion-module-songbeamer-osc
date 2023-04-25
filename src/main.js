import { InstanceBase, runEntrypoint } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import pkg from 'osc'
const OSC = pkg
import { states } from './choices.js'

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
			localPort: this.config.port,
			remotePort: this.config.port,
			broadcast: true,
			metadata: true,
		})

		/**
		 * Listener to receive messages
		 */
		this.osc.on('message', (oscMsg, timeTag, info) => {
			this.log('debug', `Received OSC message from: ${JSON.stringify(info)}`)

			const address = oscMsg['address']
			const args = oscMsg['args'][0]
			let value = args['value']

			this.log('debug', `OSC Content is: ${JSON.stringify(oscMsg)}`)

			switch (address) {
				case '/presentation/page':
					this.log('debug', `/presentation/page ${value}`)
					this.setVariableValues({ presentation_page: value })
					this.checkFeedbacks('presentation_page')
					break
				case '/presentation/pagecount':
					this.log('debug', `/presentation/pagecount ${value}`)
					this.setVariableValues({ presentation_pagecount: value })
					this.checkFeedbacks('presentation_pagecount')
					break
				case '/presentation/filename':
					this.log('info', `/presentation/filename ${value}`)
					value = value.split(/\\|\//)
					value = value[value.length - 1]
					value = value.split('.').slice(0, -1).join('.')
					this.setVariableValues({ presentation_filename: value })
					this.checkFeedbacks('presentation_filename')
					break
				case '/playlist/filename':
					this.log('info', `/playlist/filename ${value}`)
					value = value.split(/\\|\//)
					value = value[value.length - 1]
					value = value.split('.').slice(0, -1).join('.')
					this.setVariableValues({ playlist_filename: value })
					this.checkFeedbacks('playlist_filename')
					break
				case '/playlist/itemindex':
					this.log('debug', `/playlist/itemindex ${value}`)
					this.setVariableValues({ playlist_itemindex: value + 1 })
					this.checkFeedbacks('playlist_itemindex')
					break
				case '/playlist/count':
					this.log('warn', `/playlist/count ${value} not yet implemented`)
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
					this.setVariableValues({ presentation_state: states[value] })
					this.checkFeedbacks('presentation_state')
					break
				case '/presentation/message/text':
					this.log('debug', `presentation/message/text ${value}`)
					this.setVariableValues({ presentation_message_text: value })
					this.checkFeedbacks('presentation_message_text')
					this.log(
						'info',
						'presentation visibility is set to 1 on purpose because Songbeamer is ommiting state change in /xremote see #24 '
					)
					this.setVariableValues({ presentation_message_visible: true })
					this.checkFeedbacks('presentation_message_visible')
					break
				case '/presentation/message/visible':
					this.log('debug', `presentation/message/visible ${value}`)
					this.setVariableValues({ presentation_message_visible: value == 1 })
					this.checkFeedbacks('presentation_message_visible')
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
			this.heartbeat = setInterval(function () {
				self.osc_update_polling()
				self.osc_update_polling()
			}, 9500) // just before 10 sec expiration
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
			this.log('error', 'Error: ' + err.message)
			this.updateStatus('UnknownError', err.message)
			if (this.heartbeat) {
				clearInterval(this.heartbeat)
				delete this.heartbeat
			}
		})

		// Open the socket.
		this.osc.open()
		this.log('debug', `osc_server_init method finished ${this.osc}`)
	}
}

runEntrypoint(SongbeamerInstance, UpgradeScripts)

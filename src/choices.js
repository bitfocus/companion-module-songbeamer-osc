import { combineRgb } from '@companion-module/base'

export const presentation_states = ['black', 'background', 'page', 'logo']
export const video_states = ['stop', 'play', 'pause']
export const livevideo_states = ['stop', 'play']
export const comparators = ['less', 'less or equal', 'equal', 'greater or equal', 'greater']

export const sng_colors = {
	title: combineRgb(255, 255, 0, 0), // yellow
	chorus: combineRgb(128, 0, 255, 0), // violet
	prechorus: combineRgb(255, 85, 170, 0), // light violet
	verse: combineRgb(0, 128, 255, 0), // blue
	intro: combineRgb(0, 128, 64, 0), // green
	bridge: combineRgb(204, 0, 0), // red
	hidden: combineRgb(192, 192, 192, 0), // silver
	unknown: combineRgb(98, 176, 255, 0), // semi-transparent teal green
	chor: combineRgb(170, 176, 255, 0), // soft warm pink
}

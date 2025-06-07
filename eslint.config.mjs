import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default await (async () => {
	const baseConfig = await generateEslintConfig({
		enableTypescript: false,
		enableJest: false,
	})

	// Add your override
	baseConfig.push({
		files: ['src/**/*.js'],
		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 2022,
		},
	})

	return baseConfig
})()

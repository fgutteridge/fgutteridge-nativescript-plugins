const npsUtils = require('nps-utils');

module.exports = {
	message: 'NativeScript Plugins ~ made with ❤️  Choose a command to start...',
	pageSize: 32,
	scripts: {
		default: 'nps-i',
		nx: {
			script: 'nx',
			description: 'Execute any command with the @nrwl/cli',
		},
		format: {
			script: 'nx format:write',
			description: 'Format source code of the entire workspace (auto-run on precommit hook)',
		},
		'🔧': {
			script: `npx cowsay "NativeScript plugin demos make developers 😊"`,
			description: '_____________  Apps to demo plugins with  _____________',
		},
		// demos
		apps: {
			'...Vanilla...': {
				script: `npx cowsay "Nothing wrong with vanilla 🍦"`,
				description: ` 🔻 Vanilla`,
			},
			demo: {
				clean: {
					script: 'nx run demo:clean',
					description: '⚆  Clean  🧹',
				},
				ios: {
					script: 'nx run demo:ios',
					description: '⚆  Run iOS  ',
				},
				android: {
					script: 'nx run demo:android',
					description: '⚆  Run Android  🤖',
				},
			},
			'...Angular...': {
				script: `npx cowsay "Test all the Angles!"`,
				description: ` 🔻 Angular`,
			},
			'demo-angular': {
				clean: {
					script: 'nx run demo-angular:clean',
					description: '⚆  Clean  🧹',
				},
				ios: {
					script: 'nx run demo-angular:ios',
					description: '⚆  Run iOS  ',
				},
				android: {
					script: 'nx run demo-angular:android',
					description: '⚆  Run Android  🤖',
				},
			},
		},
		'⚙️': {
			script: `npx cowsay "@fgutteridge/* packages will keep your ⚙️ cranking"`,
			description: '_____________  @fgutteridge/*  _____________',
		},
		// packages
		// build output is always in dist/packages
		'@fgutteridge': {
			// @fgutteridge/nativescript-google-maps
			'nativescript-google-maps': {
				build: {
					script: 'nx run nativescript-google-maps:build.all',
					description: '@fgutteridge/nativescript-google-maps: Build',
				},
			},
			// @fgutteridge/nativescript-geocoder
			'nativescript-geocoder': {
				build: {
					script: 'nx run nativescript-geocoder:build.all',
					description: '@fgutteridge/nativescript-geocoder: Build',
				},
			},
			// @fgutteridge/nativescript-validator
			'nativescript-validator': {
				build: {
					script: 'nx run nativescript-validator:build.all',
					description: '@fgutteridge/nativescript-validator: Build',
				},
			},
			// @fgutteridge/nativescript-dropdown
			'nativescript-dropdown': {
				build: {
					script: 'nx run nativescript-dropdown:build.all',
					description: '@fgutteridge/nativescript-dropdown: Build',
				},
			},
			'build-all': {
				script: 'nx run all:build',
				description: 'Build all packages',
			},
		},
		'⚡': {
			script: `npx cowsay "Focus only on source you care about for efficiency ⚡"`,
			description: '_____________  Focus (VS Code supported)  _____________',
		},
		focus: {
			'nativescript-google-maps': {
				script: 'nx run nativescript-google-maps:focus',
				description: 'Focus on @fgutteridge/nativescript-google-maps',
			},
			'nativescript-geocoder': {
				script: 'nx run nativescript-geocoder:focus',
				description: 'Focus on @fgutteridge/nativescript-geocoder',
			},
			'nativescript-validator': {
				script: 'nx run nativescript-validator:focus',
				description: 'Focus on @fgutteridge/nativescript-validator',
			},
			'nativescript-dropdown': {
				script: 'nx run nativescript-dropdown:focus',
				description: 'Focus on @fgutteridge/nativescript-dropdown',
			},
			reset: {
				script: 'nx run all:focus',
				description: 'Reset Focus',
			},
		},
		'.....................': {
			script: `npx cowsay "That's all for now folks ~"`,
			description: '.....................',
		},
	},
};

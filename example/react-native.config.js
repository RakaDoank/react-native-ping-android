const node_path = require('node:path')

/**
 * @see {@link https://github.com/react-native-community/cli/blob/main/docs/configuration.md}
 */
module.exports = {
	dependencies: {
		/**
		 * https://github.com/react-native-community/cli/blob/main/docs/autolinking.md#how-can-i-autolink-a-local-library
		 */
		'react-native-ping-android': {
			root: node_path.join(__dirname, '../package'),
		},
	},
	project: {
		ios: {
			automaticPodsInstallation: true,
		},
		android: {},
	},
}

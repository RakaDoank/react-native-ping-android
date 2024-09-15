module.exports = {
	presets: [
		'module:@react-native/babel-preset',
	],
	plugins: [
		'@babel/plugin-transform-export-namespace-from',
		[
			'module-resolver',
			{
				root: ['./'],
				extensions: [
					'.ts',
					'.tsx',
					'.js',
					'.ios.js',
					'.android.js',
					'.json',
					'.svg',
				],
				alias: {
					'@': './src',
				},
			},
		],
	],
}
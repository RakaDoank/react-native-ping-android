const targetPath = '../../package'

module.exports = {
	source: `${targetPath}/src`,
	output: `${targetPath}/lib`,
	targets: [
		[
			'commonjs',
			{
				'esm': true,
			},
		],
		[
			'module',
			{
				'esm': true,
			},
		],
		[
			'typescript',
			{
				'esm': true,
				project: `${targetPath}/tsconfig.json`,
			},
		],
	],
}

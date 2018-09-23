module.exports = {
	site: {
		title: 'Activate',
		description: 'Micro Static Site Generator in Node.js',
		basePath: process.env.NODE_ENV === 'production' ? '/test' : ''
	},
	build: {
		outputPath: process.env.NODE_ENV === 'production' ? './docs' : './public'
	}
};
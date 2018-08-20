const data = require('./src/data/data');


module.exports = {
	site: {
		title: 'Activate',
		description: 'Micro Static Site Generator in Node.js',
		basePath: process.env.NODE_ENV === 'production' ? '/test' : '',
		data
	},
	build: {
		outputPath: process.env.NODE_ENV === 'production' ? './docs' : './public'
	}
};
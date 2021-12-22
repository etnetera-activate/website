module.exports = {
	site: {
		title: 'Etnetera Activate ',
		description: 'Online konzultanti s vášní pro data',
		basePath: process.env.NODE_ENV === 'production' ? '/test' : ''
	},
	build: {
		outputPath: process.env.NODE_ENV === 'production' ? './public' : './public'
	}
};
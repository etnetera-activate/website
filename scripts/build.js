const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const config = require('../site.config');
const chokidar = require('chokidar');
let pocet = 0;
const srcPath = './src';
const distPath = config.build.outputPath;

chokidar.watch(`${srcPath}`, {ignored: /(^|[\/\\])\.\./}).on('all', (event, path) => {
	console.log(event, path);
	const re = new RegExp("^(.(.*\\.html|.*\\.md|.*\\.ejs))*$");

	if(re.test(path)){
		console.log(path);
	}

	if (event === "change") {
	     build();
	} else {
		fse.copy(`${srcPath}/assets/css`, `${distPath}/assets/css`);
		//TODO: lepsi sprava souboru, nekdy se stane, ze kopirovani vytvori nekolik kopii souboru
		fse.copy(`${srcPath}/assets`, `${distPath}/assets`);
	}


});

const build = function(){
	pocet++;
	console.log(pocet);
	console.log("Build started")
	// clear destination folder


	// copy assets folder
	fse.copy(`${srcPath}/assets`, `${distPath}/assets`);

	// read pages
	const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

	console.log("processing files...")
	files.forEach((file, i) => {
		console.log("file : " + file);
		const fileData = path.parse(file);
		const destPath = path.join(distPath, fileData.dir);

		// create destination directory
		console.log("Creating destination path "+ destPath)
		fse.mkdirsSync(destPath);

		// read page file
		const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');

		// render page
		const pageData = frontMatter(data);
		const templateConfig = Object.assign({}, config, {
			page: pageData.attributes
		});
		let pageContent;

		// generate page content according to file type
		switch (fileData.ext) {
			case '.md':
				pageContent = marked(pageData.body);
				break;
			case '.ejs':
				pageContent = ejs.render(pageData.body, templateConfig, {
					filename: `${srcPath}/pages/${file}`
				});
				break;
			default:
				pageContent = pageData.body;
		}

		// render layout with page contents
		const layout = pageData.attributes.layout || 'default';
		const layoutFileName = `${srcPath}/layouts/${layout}.ejs`;
		const layoutData = fse.readFileSync(layoutFileName, 'utf-8');
		const completePage = ejs.render(
			layoutData,
			Object.assign({}, templateConfig, {
				body: pageContent,
				filename: layoutFileName
			})
		);

		// save the html file
		console.log(`[writing] ${destPath}/${fileData.name}.html`)
		fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage);
	});


}


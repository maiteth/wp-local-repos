const replace = require('replace-in-file');

class DbUtils {
	makeTemplate(inputFilename, database, url) {
		const options = {
			//Single file or glob 
			files: inputFilename,

			//Replacement to make (string or regex) 
			from: [
				/\),\(/g,
				new RegExp(url, 'g'),
				/^\(3,'blogname','.*','yes'\),$/mg,
				new RegExp(`theme_mods_${database}`)
			],
			to: [
				'),\n(',
                '<%= url %>',
                // eslint-disable-next-line
				"(3,'blogname','<%= blogname %>','yes'),",
				'theme_mods_<%= database %>'
			],
		};
		replace(options)
			.then(changedFiles => {
				console.log('Modified files:', changedFiles.join(', '));
			})
			.catch(error => {
				console.error('Error occurred:', error);
			});
	}
}
module.exports = new DbUtils();

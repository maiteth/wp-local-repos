const replace = require('replace-in-file');

class DbUtils {
	makeTemplate(inputFilename, database, url, prefix, cb) {
		const options = {
			//Single file or glob 
			files: inputFilename,

			//Replacement to make (string or regex) 
			from: [
				/\),\(/g,
				new RegExp(url, 'g'),
				/^\(3,'blogname','.*','yes'\),$/mg,
				new RegExp(`theme_mods_${database}`),
				new RegExp(`^(.*(?:TABLE|table|Table|INSERT INTO).*?)${prefix}(.*)$`, 'mg'),
				new RegExp(`^(\\(\\d+,\\d+,')${prefix}(.*)$`, 'mg'),
				new RegExp(`^(\\(\\d+,')${prefix}(.*)$`, 'mg'),
			],
			to: [
				'),\n(',
				'<%= url %>',
				// eslint-disable-next-line
				"(3,'blogname','<%= blogname %>','yes'),",
				'theme_mods_<%= database %>',
                '$1wp_$2',
                '$1wp_$2',
                '$1wp_$2',
			],
		};
		replace(options)
			.then(changedFiles => {
				console.log('Modified files:', changedFiles.join(', '));
				if (cb) {
					cb();
				}
			})
			.catch(error => {
				console.error('Error occurred:', error);
			});
	}
}
module.exports = new DbUtils();

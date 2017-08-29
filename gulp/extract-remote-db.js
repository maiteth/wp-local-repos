const cfgUtils = require('../lib/utils.js');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const rp = require('request-promise');
const deployEnv = cfgUtils.getEnv('deploy');
const fs = require('fs');
const dbUtils = require('../lib/db-utils.js');

module.exports = function(gulp, pathConfig) {
	gulp.task('extract-remote-db:ftp', function() {
		console.log('env', deployEnv);
		console.log('env.ftp', deployEnv.ftp);
		return gulp.src(pathConfig.extractRemoteDb)
			.pipe(ftp(deployEnv.ftp))
			.pipe(gutil.noop());
	});

	gulp.task('extract-remote-db:extract', function(cb) {
		rp(deployEnv.url + '/extract-remote-db.php')
			.then(function(sqlString) {
				fs.writeFile('./sql/remote-db.sql', sqlString, function(err) {
					if (err) {
						return console.log(err);
					}
					console.log('The file was saved!');
					const database = deployEnv.mysql.database;
					const prefix = deployEnv.mysql.prefix;
					const url = deployEnv.url;
					console.log('database', database);
					console.log('url', url);
					dbUtils.makeTemplate('./sql/remote-db.sql', database, url, prefix, cb);
				});
			})
			.catch(function(err) {
				console.log('error', err);
				throw err;
			});
	});

	gulp.task('extract-remote-db', function(cb) {
		console.log('extract-remote-db');
		runSequence('extract-remote-db:ftp', 'extract-remote-db:extract');
		cb();
	});
};

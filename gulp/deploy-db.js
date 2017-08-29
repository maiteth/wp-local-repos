const cfgUtils = require('../lib/utils.js');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const rp = require('request-promise');
const deployEnv = cfgUtils.getEnv('deploy');

module.exports = function(gulp, pathConfig) {
	gulp.task('deploy-db:ftp', function() {
		console.log('env', deployEnv);
		console.log('env.ftp', deployEnv.ftp);
		return gulp.src(pathConfig.ftp)
			.pipe(ftp(deployEnv.ftp))
			.pipe(gutil.noop());
	});

	gulp.task('deploy-db:import', function(cb) {
		rp(deployEnv.url + '/deploy.php')
			.then(function(htmlString) {
				console.log('htmlString', htmlString);
				cb();
			})
			.catch(function(err) {
				console.log('error', err);
				throw err;
			});
	});

	gulp.task('deploy-db', function(cb) {
		console.log('deploy-db');
		runSequence('deploy-db:ftp', 'deploy-db:import');
		cb();
	});
};

const cfgUtils = require('../lib/utils.js');
const ftp = require('gulp-ftp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const rp = require('request-promise');
const zip = require('gulp-zip');

module.exports = function(gulp, path) {
	gulp.task('deploy:zip', function(callback) {
		return gulp.src(path.zipSrc, {
				base: 'dist'
			})
			.pipe(zip(path.zip))
			.pipe(gulp.dest('.'));
	});

	gulp.task('deploy:ftp', function() {
		const deployEnv = cfgUtils.getEnv('deploy');
		console.log('env', deployEnv);
		console.log('env.ftp', deployEnv.ftp);
		return gulp.src(path.ftp)
			.pipe(ftp(deployEnv.ftp))
			.pipe(gutil.noop());
	});

	gulp.task('deploy:unzip', function(callback) {
		const deployEnv = cfgUtils.getEnv('deploy');
		rp(deployEnv.url + '/deploy.php')
			.then(function(htmlString) {
				console.log('htmlString', htmlString);
				callback();
			})
			.catch(function(err) {
				console.log('error', err);
				throw err;
			});
	});

	gulp.task('deploy', ['clean:zip'], function() {
		runSequence('deploy:zip', 'deploy:ftp', 'deploy:unzip');
	});
};

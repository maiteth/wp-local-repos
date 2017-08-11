const cfgUtils = require('../lib/utils.js');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const runSequence = require('run-sequence');
const rp = require('request-promise');

module.exports = function(gulp, path) {
	gulp.task('undeploy:ftp', function() {
		const deployEnv = cfgUtils.getEnv('deploy');
		console.log('env.ftp', deployEnv.ftp);
		return gulp.src(path.undeploy)
			.pipe(ftp(deployEnv.ftp))
			.pipe(gutil.noop());
	});

	gulp.task('undeploy:remove', function(cb) {
		const deployEnv = cfgUtils.getEnv('deploy');
		rp(deployEnv.url + '/remove.php')
			.then(function(htmlString) {
				console.log('htmlString', htmlString);
				cb();
			})
			.catch(function(err) {
				console.log('error', err);
				throw err;
			});
	});

	gulp.task('undeploy', function() {
		runSequence('undeploy:ftp', 'undeploy:remove');
	});
};

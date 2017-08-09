const del = require('del');

module.exports = function (gulp, path) {
	// Delete the dist directory
	gulp.task('clean:dist', function () {
		return del([path.dist]);
	});

	gulp.task('clean:zip', function () {
		return del([path.zip]);
	});

	gulp.task('clean', ['clean:dist', 'clean:zip']);
}
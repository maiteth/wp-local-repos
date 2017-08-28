module.exports = function (gulp, path) {
	// Delete the dist directory
	gulp.task('clean:dist', function (cb) {
		cb();
	});

	gulp.task('clean', ['clean:dist']);
};

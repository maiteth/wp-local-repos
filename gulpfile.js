const gulp = require('gulp');

gulp.task('default', ['config']);

const path = {
	base: 'app',
	dist: 'dist',
	zipSrc: ['dist/**/*', 'dist/**/.*'],
	zip: 'dist.zip',
	htaccess: ['cfg/.htaccess.tmpl'],
	wpConfig: ['cfg/wp-config.php.tmpl'],
	deployConfig: ['cfg/deploy-config.php.tmpl'],
	sql: ['sql/wordpress.sql'],
	resources: ['app/**/*', 'app/**/.*', '!app/.htaccess', '!app/wp-config.php'],
	ftp: ['dist.zip', 'lib/deploy/deploy.php'],
	undeploy: 'lib/deploy/remove.php',
};

require('./gulp/clean.js')(gulp, path);
require('./gulp/config.js')(gulp, path);
require('./gulp/build.js')(gulp, path);
require('./gulp/deploy.js')(gulp, path);
require('./gulp/undeploy.js')(gulp, path);

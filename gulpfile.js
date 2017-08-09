const gulp = require('gulp');
const ejs = require('gulp-ejs');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const rp = require('request-promise');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const zip = require('gulp-zip');
const phpUtils = require('./lib/phpUtils.js');
const cfgUtils = require('./lib/utils.js');

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

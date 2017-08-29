const gulp = require('gulp');
const path = require('path');

gulp.task('default', ['config']);

const repositoryName = path.basename(__dirname);
console.log('repositoryName', repositoryName);

const pathConfig = {
	base: 'app',
	dist: path.resolve(__dirname, `../${repositoryName}-dist`),
	htaccess: ['cfg/.htaccess.tmpl'],
	wpConfig: ['cfg/wp-config.php.tmpl'],
	deployConfig: ['cfg/deploy-config.php.tmpl'],
	sql: ['sql/wordpress.sql'],
	resources: ['app/**/*', 'app/**/.*', '!app/.htaccess', '!app/wp-config.php'],
	ftp: [`../${repositoryName}-dist/deploy-config.php`, 'lib/deploy/deploy.php'],
	undeploy: 'lib/deploy/remove.php',
	extractRemoteDb: ['lib/extract/extract-remote-db.php', `../${repositoryName}-dist/deploy-config.php`],
};

require('./gulp/clean.js')(gulp, pathConfig);
require('./gulp/config.js')(gulp, pathConfig);
require('./gulp/build.js')(gulp, pathConfig);
require('./gulp/deploy.js')(gulp, pathConfig);
require('./gulp/deploy-db.js')(gulp, pathConfig);
require('./gulp/undeploy.js')(gulp, pathConfig);
require('./gulp/extract-remote-db.js')(gulp, pathConfig);

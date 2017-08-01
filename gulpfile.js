const gulp = require('gulp');
const ejs = require("gulp-ejs");


const replace = require('gulp-replace');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const del = require('del');
// const fs = require('fs');
const rp = require('request-promise');
// const consolidate = require('consolidate');
// const ejs = require('ejs');
// consolidate.requires.ejs = ejs;
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const zip = require('gulp-zip');
// const glob = require('glob');

// const Promise = require('bluebird');
// Promise.promisifyAll(fs);
// const globAsync = Promise.promisify(glob);

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

gulp.task('config:htaccess', function () {
	const devEnv = cfgUtils.getEnv('dev');
	return gulp.src(path.htaccess)
		.pipe(ejs(devEnv.htaccess))
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest(path.base));
});

gulp.task('config:wp-config', function () {
	const devEnv = cfgUtils.getEnv('dev');	
	return gulp.src(path.wpConfig)
		.pipe(ejs(devEnv.mysql))
		.pipe(rename('wp-config.php'))
		.pipe(gulp.dest(path.base));
});

gulp.task('config:db-import', function (cb) {
	require('./utils/db-import.js');
	cb();
});

gulp.task('config', ['config:htaccess', 'config:wp-config', 'config:db-import']);


// Delete the dist directory
gulp.task('clean:dist', function () {
	return del([path.dist]);
});

gulp.task('clean:zip', function () {
	return del([path.zip]);
});

gulp.task('clean', ['clean:dist', 'clean:zip']);






gulp.task('resources', function () {
	return gulp.src(path.resources, {
			base: path.base
		})
		.pipe(gulp.dest(path.dist));
});

gulp.task('htaccess', function () {
	const deployEnv = cfgUtils.getEnv('deploy');
	return gulp.src(path.htaccess)
		.pipe(ejs(deployEnv.htaccess))
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('wp-config', function () {
	const deployEnv = cfgUtils.getEnv('deploy');
	return gulp.src(path.wpConfig)
		.pipe(ejs(deployEnv.mysql))
		.pipe(rename('wp-config.php'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('deploy-config', function () {
	const deployEnv = cfgUtils.getEnv('deploy');
	return gulp.src(path.deployConfig)
		.pipe(ejs(deployEnv.mysql))
		.pipe(rename('deploy-config.php'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('sql', function (cb) {
	const deployEnv = cfgUtils.getEnv('deploy');
	const devEnv = cfgUtils.getEnv('dev');
	const prefix = deployEnv.mysql.prefix;
	console.log('prefix', prefix);
	const localUrl = devEnv.url;
	const deployUrl = deployEnv.url;
	const regexp = /<%= url %>/g;
	return gulp.src(path.sql)
		.pipe(replace(/^(.*(?:TABLE|table|Table|INSERT INTO).*?)wp_(.*)$/mg, `$1${prefix}$2`))
		.pipe(replace(/^(\(\d+,\d+,')wp_(.*)$/mg, `$1${prefix}$2`))
		.pipe(replace(/^(\(\d+,')wp_(.*)$/mg, `$1${prefix}$2`))
		.pipe(replace(regexp, `${deployUrl}`))
		.pipe(rename('database.sql'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('build', function () {
	runSequence(['resources', 'htaccess', 'wp-config', 'deploy-config', 'sql']);
});

gulp.task('rebuild', function () {
	runSequence('clean', 'build');
});






gulp.task('deploy:zip', function (callback) {
	return gulp.src(path.zipSrc, {
			base: 'dist'
		})
		.pipe(zip(path.zip))
		.pipe(gulp.dest('.'));
});

gulp.task('deploy:ftp', function () {
	const deployEnv = cfgUtils.getEnv('deploy');
	console.log('env', deployEnv);
	console.log('env.ftp', deployEnv.ftp);
	return gulp.src(path.ftp)
		.pipe(ftp(deployEnv.ftp))
		.pipe(gutil.noop());
});

gulp.task('deploy:unzip', function (callback) {
	const deployEnv = cfgUtils.getEnv('deploy');
	rp(deployEnv.url + '/deploy.php')
		.then(function (htmlString) {
			console.log('htmlString', htmlString);
			callback();
		})
		.catch(function (err) {
			console.log('error', err);
			throw err;
		});
});

gulp.task('deploy', ['clean:zip'], function () {
	runSequence('deploy:zip', 'deploy:ftp', 'deploy:unzip');
});





gulp.task('undeploy:ftp', function () {
	const deployEnv = cfgUtils.getEnv('deploy');
	console.log('env.ftp', deployEnv.ftp);
	return gulp.src(path.undeploy)
		.pipe(ftp(deployEnv.ftp))
		.pipe(gutil.noop());
});

gulp.task('undeploy:remove', function (callback) {
	const deployEnv = cfgUtils.getEnv('deploy');
	rp(deployEnv.url + '/remove.php')
		.then(function (htmlString) {
			console.log('htmlString', htmlString);
			callback();
		})
		.catch(function (err) {
			console.log('error', err);
			throw err;
		});
});

gulp.task('undeploy', function () {
	runSequence('undeploy:ftp', 'undeploy:remove');
});
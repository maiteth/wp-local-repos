const cfgUtils = require('../lib/utils.js');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const textTransformation = require('gulp-text-simple');
const phpUtils = require('../lib/phpUtils.js');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const mkdirp = require('mkdirp');
const exec = require('child_process').exec;

function next(callback) {
	return function report(error, stdout, stderr) {
		console.log('stdout', stdout);
		console.error('stderr', stderr);
		if (error !== null) {
			console.log('exec error: ', error);
			return;
		}
		if (callback) {
			callback();
		}
	};
}

module.exports = function(gulp, pathConfig) {

	gulp.task('build:init', function(cb) {
		mkdirp.sync(pathConfig.dist);
		exec('git init', { cwd: pathConfig.dist },
			next(function() {
				console.log('Init successful.');
				cb();
			}));
	});

	gulp.task('build:resources', function() {
		console.log('Ressources.', process.cwd());
		return gulp.src(pathConfig.resources, {
				base: pathConfig.base
			})
			.pipe(gulp.dest(pathConfig.dist));
	});

	gulp.task('build:htaccess', function() {
		const deployEnv = cfgUtils.getEnv('deploy');
		return gulp.src(pathConfig.htaccess)
			.pipe(ejs(deployEnv.htaccess))
			.pipe(rename('.htaccess'))
			.pipe(gulp.dest(pathConfig.dist));
	});

	gulp.task('build:wp-config', function() {
		const deployEnv = cfgUtils.getEnv('deploy');
		return gulp.src(pathConfig.wpConfig)
			.pipe(ejs(deployEnv.mysql))
			.pipe(rename('wp-config.php'))
			.pipe(gulp.dest(pathConfig.dist));
	});

	gulp.task('build:deploy-config', function() {
		const deployEnv = cfgUtils.getEnv('deploy');
		return gulp.src(pathConfig.deployConfig)
			.pipe(ejs(deployEnv.mysql))
			.pipe(rename('deploy-config.php'))
			.pipe(gulp.dest(pathConfig.dist));
	});

	const phpFixSerialization = textTransformation(phpUtils.fixSerialization);

	gulp.task('build:sql', function(cb) {
		const deployEnv = cfgUtils.getEnv('deploy');
		const devEnv = cfgUtils.getEnv('dev');
		const prefix = deployEnv.mysql.prefix;
		console.log('prefix', prefix);
		const deployUrl = deployEnv.url;
		const blogname = devEnv.blogname;
		const regexp = /<%= url %>/g;
		return gulp.src(pathConfig.sql)
			.pipe(replace(/^(.*(?:TABLE|table|Table|INSERT INTO).*?)wp_(.*)$/mg, `$1${prefix}$2`))
			.pipe(replace(/^(\(\d+,\d+,')wp_(.*)$/mg, `$1${prefix}$2`))
			.pipe(replace(/^(\(\d+,')wp_(.*)$/mg, `$1${prefix}$2`))
			.pipe(replace(regexp, `${deployUrl}`))
			.pipe(replace(/<%= blogname %>/g, `${blogname}`))
			.pipe(phpFixSerialization())
			.pipe(rename('database.sql'))
			.pipe(gulp.dest(pathConfig.dist));
	});

	gulp.task('build:commit', function(cb) {
		exec('git add *', { cwd: pathConfig.dist }, next(function() {
			console.log('Add successful.');
			exec('git commit --allow-empty -m "cool"', { cwd: pathConfig.dist }, next(function() {
				console.log('Commit successful.');
				cb();
			}));
		}));
	});

	gulp.task('build', function() {
		runSequence('build:init', [
			'build:resources',
			'build:htaccess',
			'build:wp-config',
			'build:deploy-config',
			'build:sql'
		], 'build:commit');
	});

	gulp.task('rebuild', function() {
		runSequence('clean', 'build');
	});
};

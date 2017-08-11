const cfgUtils = require('../lib/utils.js');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const deployEnv = cfgUtils.getEnv('deploy');

module.exports = function(gulp, pathConfig) {
	gulp.task('deploy:push', function(cb) {
		function init() {
			const init = spawn('git', [
				'ftp',
				'init',
				'-u',
				deployEnv.ftp.user,
				'-p', deployEnv.ftp.pass,
				`${deployEnv.ftp.host}/${deployEnv.ftp.remotePath}`
			], { cwd: pathConfig.dist });
			init.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});

			init.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
			});
			init.on('close', (code) => {
				console.log(`git init exited with code ${code}`);
			});

			init.on('error', (err) => {
				console.log('init failed.', err);
			});
		}

		const push = spawn('git', [
			'ftp',
			'push',
			'-u',
			deployEnv.ftp.user,
			'-p', deployEnv.ftp.pass,
			`${deployEnv.ftp.host}/${deployEnv.ftp.remotePath}`
		], { cwd: pathConfig.dist });

		push.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		push.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		push.on('error', (err) => {
			console.log('push failed.');
			init();
		});

		push.on('close', (code) => {
			console.log(`git push exited with code ${code}`);
			if (code > 0) {
				console.log('code > 0 : ', code);
				init();
			}
			cb();
		});
	});

	gulp.task('deploy', function(cb) {
		runSequence('deploy:push', 'deploy-db');
		cb();
	});
};

const exec = require('child_process').exec;
const cfgUtils = require('../lib/utils.js');
const devEnv = cfgUtils.getEnv('dev');

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

const user = devEnv.mysql.username;
const password = devEnv.mysql.password;
const hostname = devEnv.mysql.hostname;
const database = devEnv.mysql.database;
exec(`mysql -u ${user} --password=${password} -h ${hostname} < sql/restore-db.sql`, next(function () {
    exec(`mysql -u ${user} --password=${password} -h ${hostname} < sql/restore-db.sql`, next(function () {
        console.log('about to import');
        exec(`mysql -u ${user} --password=${password} -h ${hostname} ${database} < sql/wp-local-repos.sql`, next());
    }))
}));

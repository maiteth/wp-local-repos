const exec = require('child_process').exec;
const replace = require('replace-in-file');
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
exec(`mysqldump -u ${user} --password=${password} -h ${hostname} ${database} -r sql/wordpress.sql`, next(function () {
    console.log('Successful.');
    const options = {
        //Single file or glob 
        files: 'sql/wordpress.sql',

        //Replacement to make (string or regex) 
        from: /\),\(/g,
        to: '),\n(',
    };
    replace(options)
        .then(changedFiles => {
            console.log('Modified files:', changedFiles.join(', '));
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}));

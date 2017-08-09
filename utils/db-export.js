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
const url = devEnv.url;
exec(`mysqldump -u ${user} --password=${password} -h ${hostname} ${database} -r sql/wordpress.sql`, next(function () {
    console.log('Successful.');
    const options = {
        //Single file or glob 
        files: 'sql/wordpress.sql',

        //Replacement to make (string or regex) 
        from: [/\),\(/g, new RegExp(url, 'g'), /^\(3,'blogname','.*','yes'\),$/mg, new RegExp(`theme_mods_${database}`)],
        to: ['),\n(', '<%= url %>', "(3,'blogname','<%= blogname %>','yes'),", 'theme_mods_<%= database %>'],
    };
    replace(options)
        .then(changedFiles => {
            console.log('Modified files:', changedFiles.join(', '));
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}));

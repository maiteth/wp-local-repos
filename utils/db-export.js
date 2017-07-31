const exec = require('child_process').exec;
const replace = require('replace-in-file');

function next(callback) {
    return function report(error, stdout, stderr) {
        console.log('stdout', stdout);
        console.error('stderr', stderr);
        if (error !== null) {
            console.log('exec error: ', error);
        }
        if (callback) {
            callback();
        }
    };
}


const user = 'maiteth';
exec(`mysqldump -u ${user} --password=1234 wp-local-repos -r sql/wp-local-repos.sql`, next(function () {
    console.log('c est fini');
    const options = {
        //Single file or glob 
        files: 'sql/wp-local-repos.sql',

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

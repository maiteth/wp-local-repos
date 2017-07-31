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

const user = 'maiteth';
exec(`mysql -u ${user} --password=1234 -h localhost < sql/restore-db.sql`, next(function () {
    console.log('about to import');
    exec(`mysql -u ${user} --password=1234 -h localhost wp-local-repos < sql/wp-local-repos.sql`, next());
}));

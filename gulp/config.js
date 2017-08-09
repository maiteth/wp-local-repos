const cfgUtils = require('../lib/utils.js');
const ejs = require("gulp-ejs");
const rename = require('gulp-rename');

module.exports = function (gulp, path) {
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
        require('../utils/db-import.js');
        cb();
    });

    gulp.task('config', ['config:htaccess', 'config:wp-config', 'config:db-import']);
};

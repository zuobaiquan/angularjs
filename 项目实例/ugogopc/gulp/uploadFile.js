var gulp = require('gulp');
var sftp = require('gulp-sftp');

gulp.task('upload-p', function () {
    return gulp.src('./release/**')
        .pipe(sftp({
            host: '122.152.212.17',
            user: 'root',
            pass: 'Ugogo*741258',
            port:22,
            remotePath:'/home/ugogo/admin/merchant',
        }));
});

gulp.task('upload-t', function () {
    return gulp.src('./release/**')
        .pipe(sftp({
            host: '121.41.90.22',
            user: 'root',
            pass: 'eva*2016',
            port:22,
            remotePath:'/home/evatest/admins/ugogo/pc',
        }));
});

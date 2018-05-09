var gulp = require('gulp');
var sftp = require('gulp-sftp');

gulp.task('upload-p', ['rev'], function () {
    return gulp.src('./www/**')
        .pipe(sftp({
            host: '139.224.238.153',
            user: 'root',
            port: '22',
            pass: '4qK3E&Qv',
            remotePath: '/root/app'
        }));
});

// gulp.task('upload', ['rev'], function () {
//     return gulp.src('./www/**')
//         .pipe(sftp({
//             host: '121.41.90.22',
//             user: 'evatest',
//             port: '22',
//             pass: 'eva*2016',
//             remotePath: '/home/evatest/apps/cak'
//         }));
// });

gulp.task('upload', ['rev'], function () {
    return gulp.src('./www/**')
        .pipe(sftp({
            host: '121.41.90.22',
            user: 'root',
            port: '22',
            pass: 'eva*2016',
            remotePath: '/home/evatest/apps/qdyq'
        }));
});

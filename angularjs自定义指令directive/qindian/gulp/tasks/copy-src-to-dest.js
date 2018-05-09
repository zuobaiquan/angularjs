var gulp = require('gulp');

// copy all files under the SRC to the WWW directory
// =================================================================
gulp.task('copy-src-to-dest', function () {
    gulp.src(['./src/**/*', './src/index.html', '!./src/*.*___jb_tmp___', '!./src/**/*.*___jb_tmp___'])
        .pipe(gulp.dest('./www'));
});
var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require('../config');

// watch SRC folder
// =================================================================
gulp.task('watch-src-folder', function () {
    gulp.src(['./src/*', './src/**/*', '!./src/*.*___jb_tmp___', '!./src/**/*.*___jb_tmp___'], {base: './src'})
        .pipe(watch(['./src', '!./src/*.*___jb_tmp___','!./src/**/*.*___jb_tmp___'], {base: './src'}))
        .pipe(gulp.dest('./www'));
    gulp.watch('src/app/**/*.scss',['sass']);
    gulp.watch('src/css/**/*',['sass']);
    gulp.watch('src/css/*',['sass']);
    gulp.watch(config.paths.sass, ['sass']);
});
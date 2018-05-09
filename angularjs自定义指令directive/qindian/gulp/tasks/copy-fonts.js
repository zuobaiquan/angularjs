var gulp = require('gulp');
var config = require('../config');
var gulpCopy = require('gulp-copy');
// copy fonts task
gulp.task('copy-fonts', function () {
    return gulp.src(['./src/css/fonts/*', './src/lib/ionic/fonts/*'])
        // .pipe(gulp.dest('./www/css/fonts'))
        .pipe(gulpCopy(config.paths.dist, {prefix: 1}));
        // .pipe(gulpCopy('./www/css/fonts', {prefix: 1}));
});
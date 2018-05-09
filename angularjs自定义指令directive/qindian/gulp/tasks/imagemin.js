var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../config');
// imagemin images and output them in dist
// =================================================================
gulp.task('imagemin', function () {
    gulp.src(config.paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(config.paths.dist + '/app'));
});

gulp.task('common-imagemin', function () {
    gulp.src(config.paths.commonimages)
        .pipe(imagemin())
        .pipe(gulp.dest(config.paths.dist + '/img'));
});
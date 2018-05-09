var gulp = require('gulp');
var inject = require('gulp-inject');
var config = require('../config');
// automatic injection third library script in the index file
// =================================================================
gulp.task('inject-libs-to-index-html', function () {
    gulp.src('./src/index.html')
        .pipe(inject(gulp.src(config.paths.lib, {read: false}), {relative: true}))
        .pipe(gulp.dest('./src'));
});
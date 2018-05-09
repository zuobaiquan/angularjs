var gulp = require('gulp');
var config = require('../config');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rev = require('gulp-rev');

// minify third library script
// =================================================================
gulp.task('minify-third-library-js', function () {
    gulp.src(config.paths.lib)
        // .pipe(uglify())
        .pipe(concat('app.plugin.min.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.rev.js))
        .pipe(rev.manifest())
        // .pipe(concat('rev-manifest.plugin.json'))
        .pipe(gulp.dest(config.rev.revJson+'/plugin'));
});
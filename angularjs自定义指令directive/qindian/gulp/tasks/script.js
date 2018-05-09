var gulp = require('gulp');
var config = require('../config');
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var gutil = require('gulp-util');

// scripts task
// =================================================================
gulp.task('scripts', function () {
    gulp.src(config.paths.scripts)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(uglify())
        // .pipe(uglify().on('error', gutil.log))
        .pipe(concat('app.bundle.min.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.rev.js))
        .pipe(rev.manifest())
        // .pipe(concat('rev-manifest.bundle.json'))
        .pipe(gulp.dest(config.rev.revJson + '/bundle'));
        // .pipe(gulp.dest(config.paths.dist + '/js'));
});
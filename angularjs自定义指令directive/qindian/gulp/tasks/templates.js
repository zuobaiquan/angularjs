var gulp = require('gulp');
var config = require('../config');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
// templatesCache task
// =================================================================
gulp.task('templates', function () {
    gulp.src(config.paths.templates)
        .pipe(minifyHtml({empty: true}))
        .pipe(templateCache({
            standalone: true,
            root: 'app'
        }))
        .pipe(rev())
        .pipe(gulp.dest(config.rev.js))
        .pipe(rev.manifest())
        // .pipe(concat('rev-manifest.templates.json'))
        .pipe(gulp.dest(config.rev.revJson+'/templates'));
});
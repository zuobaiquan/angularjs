var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var stylelint = require('stylelint');
var postcss = require('gulp-postcss');
var syntax_scss = require('postcss-scss');
var rev = require('gulp-rev');
var config = require('../config');
var concat = require('gulp-concat');

// sass task
// =================================================================
gulp.task('sass', function(done) {
  gulp.src('./src/css/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    // .pipe(gulp.dest('./www/css/'))
    .pipe(rev())
    .pipe(gulp.dest(config.rev.css))
    .pipe(rev.manifest())
    // .pipe(concat('rev-manifest.sass.json'))
    .pipe(gulp.dest(config.rev.revJson+'/sass'))
    .on('end', done);
});

// scss lint
// =================================================================
gulp.task("scss-lint", function () {

    // stylelint config rules
    var stylelintConfig = {
        "extends": "stylelint-config-standard",
        "rules": {
            "indentation": [2, {
                "warn": true,
                "except": ["param"],
                "message": "Please use 2 spaces for indentation. Tabs make The Architect grumpy."
            }],
            "number-leading-zero": null,
        }
    }

    var processors = [
        stylelint(stylelintConfig),
        reporter({
            clearMessages: true,
            throwError: true,
        })
    ];

    return gulp.src(['./src/css/scss/*.scss'])
        .pipe(postcss(processors), {syntax: syntax_scss});
});

// style task
// =================================================================
gulp.task('styles', function () {
    gulp.src(['./src/css/style.css'])
        .pipe(gulp.dest('./www/css/'));
});
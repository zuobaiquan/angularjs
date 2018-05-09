var gulp = require('gulp');
var extend = require('gulp-extend');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');
var args = require('yargs').argv;
// api config
// =================================================================
var config = function (env) {
    gulp.src(['./src/app/config/config.default.json', 'src/app/config/config.' + env + '.json'])
        .pipe(extend('config.json', true))
        .pipe(ngConstant({
            name: 'starter.configs',
            deps: [],
        }))
        .pipe(rename(function (path) {
            path.basename = 'config';
            path.extname = '.js';
        }))
        .pipe(gulp.dest('src/app/config'));
};

gulp.task('set-api-config', function () {
    config(args.env || "development");
});
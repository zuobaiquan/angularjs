var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var args = require('yargs').argv;
var del = require('del');

var config = require('../config');

var rev = require('gulp-rev');
var revCollector = require("gulp-rev-collector");


// build task for Development mode、 Staging mode or Production mode
var developmentTask,
    stagingTask,
    productionTask;

// development task
developmentTask = ['sass', 'set-api-config', 'copy-src-to-dest', 'watch-src-folder'];

// production task   'imagemin', 'common-imagemin',
productionTask = ['sass','index', 'imagemin', 'common-imagemin','templates', 'copy-fonts', 'set-api-config',  'scripts', 'minify-third-library-js'];

// staging task
stagingTask = productionTask;


// clean task
// =================================================================
gulp.task('clean', function (cb) {
    return del([
        config.paths.dist + '/**/*'
    ], cb);
});

var arrTask = function(){

}
gulp.task('build', function (callback) {
    runSequence('clean',
        eval((args.env || "development") + "Task"),
        function () {
            // console.log(eval((args.env || "development") + "Task"));
            if (!args.env || (args.env == "development")) {
                gutil.log(gutil.colors.yellow('Watching and auto synchronizing the change from src to www, Ctrl-C to stop watching and quit'));
            }
        });
});
var gulp = require('gulp');
var config = require('../config');
var htmlreplace = require('gulp-html-replace');


// prepare Index.html for dist - ie. using min files
// =================================================================
gulp.task('index', function () {
    gulp.src(config.paths.html)
        .pipe(htmlreplace({
            'sass': 'css/ionic.app.min.css',
            'css': 'css/app.min.css',
            'js': 'js/app.bundle.min.js',
            'third-library-js': 'js/app.plugin.min.js',
            'templates': 'js/templates.js',
            'shared': 'shared/services/app.services.min.js',
            'ionic': 'lib/ionic/js/' + config.files.ionicbundle
        }))
        .pipe(gulp.dest(config.paths.dist + '/.'));
});
var gulp = require('gulp');
var config = require('../config');
var rev = require('gulp-rev');
var revCollector = require("gulp-rev-collector");

gulp.task('rev', function () {

    console.log('rev',config.rev.revJsonSrc,config.rev.dest);
    // console.log(gulp.src(config.rev.dest));
    return gulp.src([config.rev.revJsonSrc, config.rev.dest])
        .pipe( revCollector({
            replaceReved: true,
        }) )
        .pipe(gulp.dest(config.paths.dist + '/.'));
        // .pipe( gulp.dest(config.paths.dist) );
});
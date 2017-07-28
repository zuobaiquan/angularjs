var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var open = require('open');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var autoprefixer = require('autoprefixer');

var app = {
	srcPath: 'src/',
	devPath: 'build/',
	prdPath: 'dist/'
};

gulp.task('lib', function() {
	gulp.src('bower_components/**/**')
		.pipe(gulp.dest(app.devPath + 'libs'))
		.pipe(gulp.dest(app.prdPath + 'libs'))
		.pipe($.connect.reload())
});

gulp.task('html', function() {
	gulp.src(app.srcPath + '**/*.html')
		.pipe(gulp.dest(app.devPath))
		.pipe(gulp.dest(app.prdPath))
		.pipe($.connect.reload())
});

gulp.task('json', function() {
	gulp.src(app.srcPath + 'data/**/*.json')
		.pipe(gulp.dest(app.devPath + 'data'))
		.pipe(gulp.dest(app.prdPath + 'data'))
		.pipe($.connect.reload())
});

gulp.task('less', function() {
	var processors = [px2rem({remUnit: 75}),autoprefixer()];
	gulp.src(app.srcPath + 'less/main.less')
		.pipe($.less())
		.pipe(postcss(processors))
		.pipe(gulp.dest(app.devPath + 'css'))
		.pipe($.cssmin())
		.pipe(gulp.dest(app.prdPath + 'css'))
		.pipe($.connect.reload())
});

gulp.task('js', function() {
	gulp.src(app.srcPath + 'js/**/*.js')
		.pipe($.concat('index.js'))
		.pipe(gulp.dest(app.devPath + 'js'))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prdPath + 'js'))
		.pipe($.connect.reload())
});

gulp.task('image', function() {
	gulp.src(app.srcPath + 'image/**/**')
		.pipe($.plumber())
		.pipe(gulp.dest(app.devPath + 'image'))
		// .pipe($.imagemin())
		.pipe(gulp.dest(app.prdPath + 'image'))
		.pipe($.connect.reload())
});

gulp.task('clean', function() {
	gulp.src([app.devPath,app.prdPath])
		.pipe($.clean())
});

gulp.task('build',['image','js','json','less','html','lib']);

gulp.task('serve', ['build'],function() {
	$.connect.server({
		root: [app.devPath],
		livereload: true,
		port: 5000
	});
	open('http://localhost:5000');

  	gulp.watch('bower_components/**/*', ['lib']);
  	gulp.watch(app.srcPath + '**/*.html', ['html']);
  	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
  	gulp.watch(app.srcPath + 'less/**/*.less', ['less']);
  	gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
  	gulp.watch(app.srcPath + 'image/**/*', ['image']);	
});

gulp.task('default',['serve']);
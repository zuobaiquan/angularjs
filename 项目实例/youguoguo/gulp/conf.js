/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'release',
  devDist: 'dev-release',
  tmp: '.tmp',
  e2e: 'e2e',
  assets:'src/assets',
  plugins:'src/public',
  libs:{
    js:[
      'src/libs/summernote/dist/summernote.js',
      'src/libs/summernote/dist/lang/summernote-zh-CN.js',//富文本需要的语言包由此导入
      'src/libs/angular-summernote/dist/angular-summernote.js',
      'src/libs/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
      'src/libs/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
      'src/libs/verify/js/ngVerify.js'
    ],
    css:[
      'src/libs/summernote/dist/summernote.css',
      'src/libs/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
      'src/libs/verify/css/ngVerify.css'
    ]
  }
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/require\.js/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

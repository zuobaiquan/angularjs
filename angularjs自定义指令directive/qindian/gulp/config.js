var files = {
    jsbundle: 'app.bundle.min.js',
    appcss: 'app.css',
    ionicappmincss: 'ionic.app.min.css',
    ionicbundle: 'ionic.bundle.min.js'    // change to 'ionic.bundle.js' for debugging moduleErr errors
};
var paths = {
  html: ['./src/*.html'],
  sass: ['./src/css/scss/*.scss'],
  templates: ['./src/app/**/*.html','./src/app/**/templates/*.html'],
  images: ['./src/app/**/img/**'],
  commonimages: ['./src/img/**'],
  scripts: ['./src/app/*.js', './src/app/**/*.module.js', './src/app/**/*.js','!./src/app/lib/**'],
  dist: ['./www'],
  lib:[
    './src/lib/ionic/js/ionic.bundle.js',
    './src/lib/ionic-datepicker/ionic-datepicker.bundle.min.js'
  ]
};

var revJson = './www/rev';
module.exports = {
    files:files,
    paths : paths,
    rev:{
        revJson : revJson,
        js:paths.dist + '/js',
        css:paths.dist + '/css',
        revJsonSrc : revJson + '/**/*.json',
        dest:'./www/index.html'
    }


}

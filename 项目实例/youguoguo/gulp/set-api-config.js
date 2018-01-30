var gulp = require('gulp');
var fs = require('fs');
var package = require('../package.json');


// api config
// =================================================================
var config = function (env) {

	var g = require(`../src/public/config.${env}.json`);
    var date = new Date();
    g.version = package.version;
    g.updateDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    var str = JSON.stringify(g);
    var config = `
	window.globalConfig = ${str}
    `;
    fs.writeFile('src/public/config.js',config,function(err){
		if(err) throw err;
	});
};

gulp.task('set-api-development', function () {
    config("development");
});

gulp.task('set-api-production', function () {
    config("production");
});

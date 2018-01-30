# ipzoe-admin-angular

## EVA-后台管理-ANGULAR
The directory structure of this template is as follows:
```
├── bower.json               <- front-end library dependencies
├── gulpfile.js              <- main task runner file
├── package.json             <- mostly task runner dependencies
├── docs/                    <- wintersmith documentation generator
├── gulp/                    <- build tasks
├── src/                     <- main front-end assets
│   ├── 404.html
│   ├── auth.html
│   ├── index.html           <- main app dashboard page
│   ├── reg.html
│   ├── app/                 <- angular application files
│   │   ├── app.js           <- angular application entry point. Used for managing dependencies
│   │   ├── pages/           <- UI router pages. Pages created for demonstration purposes. Put your application js and html files here
│   │   ├── theme/           <- theme components. Contains various common widgets, panels which used across application
│   ├── assets/              <- static files (images, fonts etc.)
│   ├── sass/                <- sass styles
│   │   ├── app/             <- application styles. Used mostly for demonstration purposes. Put your app styles here.
│   │   │   ├── conf/        <- configs for app scss such as color and font
│   │   │   ├── .layout      <- main index css setting
│   │   ├── theme/           <- theme styles. Used to customize bootstrap and other common components used in tempate.
```

首先执行`git clone`命令下载文件：
```
$ git clone http://120.55.186.105:10080/EVA/ipzoe-admin-angular.git
```
进入项目文件夹:
```
$ cd ipzoe-admin-angular
```
拷贝部分node_modules和bower_components压缩文件解压到项目文件夹下:

```
文件地址：公司群文件blur-admin-components.zip
```
安装其他项目依赖:
```
$ cnpm install  
$ bower install
```
最后一步，启动项目:
```
开发环境：gulp serve
生产环境：gulp serve:dist

```

PS:添加css样式的时候，在sass/app下 按模块添加文件夹以及scss文件，scss文件名以_开头 类名以模块名开头 以免打包时各模块css样式冲突

非angular页面使用的插件请放置于public/plugins文件夹中,js文件直接放置在public目录下

手动修改过的插件放置在src/libs目录下，避免插件更新，把需要用到的文件（js、css）配置到 gulp/conf.js中的变量 paths.libs....

libs list :
 	1、angular-summernote, 修改了 ../dist/angular-summernote.js 144行
 	2、angular-bootstrap-datetimepicker，开发环境下必须重写bower.main,生产环境下打包会产生冲突

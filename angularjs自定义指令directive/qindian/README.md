亲点易取-微信端
=====================

A starting project for Ionic slidemenu that optionally supports using custom SCSS.

## Using this project

Firstly, clone this project :

```bash
$git clone http://120.55.186.105:10080/EVA/ionic-empty.git
```
Secondly, install package :

```bash
$ cd ionic-empty

$ cnpm install  

$ bower install
```

And then, build  project :

```bash
gulp build  //in development environment
gulp build  --env production  //in production environment

```

Finally run: 

```bash
$ ionic serve
```

## 说明
项目中的icon使用方式(icon名称参考下图，不定时更新中。此处用plus为例)：
1. 使用标签 <i class="qd-plus"></i>
2. 使用字符代替 &\#xe901;(必须用css声明样式`font-family: 'qindian' !important;`)

![](http://ww1.sinaimg.cn/large/bf2a97bdgy1fd9hozl5bmj211e0jg0tp)

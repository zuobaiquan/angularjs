var requireDir = require('require-dir');

//用require-dir引入gulp/tasks里的任务
requireDir('./gulp/tasks',{recurse:true});
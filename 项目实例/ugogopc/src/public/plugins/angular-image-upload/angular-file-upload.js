angular.module('angular-file-upload', ['ui.bootstrap'])
    .directive("fileUpload", function($document, $uibModal,toastr,IMAGE_UPLOAD) {
        return {
            template: function(elem, attrs) {
                console.log(attrs.tip);
                var res = '';
                res += '<div class="fileinput fileinput-new" data-provides="fileinput">';
                res += '<div style="margin-top:20px;text-align:center;border:1px solid #ddd;height: 200px;line-height: 200px;width:160px;">';
                res += '<span class="btn-file">';
                res += '<span class="fileinput-new">';
                res += '<img style="max-width: 160px;max-height: 200px;" src="../assets/img/image-180.png">';
                res += '</span>';
                res += '<input type="file" name="..." id="' + attrs.fileId + '" onchange="angular.element(this).scope().change()">';
                res += '</span>';
                res += '</div>';
                res += '</div>';
                return res;
            },
            // replace: true,
            restrict: 'AE',
            scope: {
                result: '=',
                size: '=',
                callback:"&",
                filetype:'@',//自定义上传图片类型 设定格式 如：data-filetype="exe,jpg" ，多种类型用逗号隔开，默认的时候可以不写data-filetype
            },
            link: function(scope, element, attributes) {
                if (attributes.multiple) {
                    scope.result = [];
                }
                scope.show = true;
                var Qiniu_UploadUrl = IMAGE_UPLOAD.url;
                var put64Url = IMAGE_UPLOAD.baseUrl;
                scope.token = IMAGE_UPLOAD.token;
                scope.link = IMAGE_UPLOAD.link;
                var data = {};
                scope.change = function() {
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var name = file.name;
                    var size = file.size/1024/1024;
                    if(size>3){
                        toastr.error('文件大小不超过3M', '', {});
                        return false;
                    }
                    var houzhui = name.substring(name.lastIndexOf('.') + 1);
                    var flag=true;
                    if(typeof scope.filetype=="undefined"){
                        //默认上传doc、docx、pdf、xls、xlsx文件
                        if((houzhui=='doc')||(houzhui=='docx')||(houzhui=='pdf')||(houzhui=='xls')||(houzhui=='xlsx')) {
                            flag=false;
                        }
                    }
                    if((typeof scope.filetype!="undefined")&&(scope.filetype!="")){
                        var arrtyper=scope.filetype.split(",");
                        for(var i=0;i<arrtyper.length;i++){
                            if(houzhui==arrtyper[i]){
                                flag=false;
                            }
                        }
                    }
                    if(flag==true){
                        toastr.error('文件选择类型错误', '', {});
                        return false;
                    }
                    var xhr = new XMLHttpRequest();
                    //xhr.upload.addEventListener("progress", updateProgress);
                    xhr.open('POST', Qiniu_UploadUrl, true);
                    var formData, startDate;
                    formData = new FormData();
                    formData.append('token', scope.token);
                    formData.append('file', file);
                    formData.append('key',moment().format("YYYYMMDDHHmmss")+"."+houzhui);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var res = eval("(" + xhr.responseText + ")");
                            scope.result = scope.link + res.key;
                            toastr.success('文件上传成功', '', {});
                            scope.key = angular.copy(res.key);
                            if(scope.callback){
                                scope.callback({data:{
                                    name:name,
                                    url:scope.result
                                }});
                            }
                            scope.$apply();
                        }
                    };
                    xhr.send(formData);
                };

                function updateProgress(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        scope.progress = percentComplete;
                        scope.$apply();
                    } else {
                    }
                }
            }
        };
    });

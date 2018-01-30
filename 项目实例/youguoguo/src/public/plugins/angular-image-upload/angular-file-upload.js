angular.module('angular-file-upload', ['ui.bootstrap'])
    .directive("fileUpload", function($document, $uibModal,toastr,IMAGE_UPLOAD) {
        return {
            template: function(elem, attrs) {
                console.log(attrs.tip);
                var res = '';
                res += '<div class="fileinput fileinput-new" data-provides="fileinput">';
                res += '<div style="padding-top:10px;text-align:center;">';
                res += '<span class="btn btn-default btn-file">';
                res += '<span class="fileinput-new">';
                res += '  选择文件';
                res += '</span>';
                res += '<input type="file" name="..." id="' + attrs.fileId + '" onchange="angular.element(this).scope().change()">';
                res += '</span>';
                res += '</div>';
                res += '</div>';
                res += '<div style="color:red;display: inline;">';
                //这里在文件上传按钮下方提供文字提示说明
                if(typeof attrs.fileTips=="undefined"){
                    res += '*文件上传类型为：doc、docx、pdf、xls、xlsx';
                }else{
                    res += '*文件上传类型为：'+attrs.fileTips;
                }
                res += '</div>';
                return res;
            },
            // replace: true,
            restrict: 'AE',
            scope: {
                result: '=',
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
                    toastr.error('正在上传文件，请稍等...', '', {});
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var res = eval("(" + xhr.responseText + ")");
                            console.log(res);
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
                        // Unable to compute progress information since the total size is unknown
                    }
                }

            }
        };
    });

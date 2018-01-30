angular.module('angular-image-upload2', ['ui.bootstrap', 'ImageCropper','util.constant'])
    .directive("imageUpload2", function($document,toastr,$timeout, $uibModal,IMAGE_UPLOAD) {
        return {
            template: function(elem, attrs) {
                var res = '';
                res += '<div class="fileinput fileinput-new" style="text-align:center;height: 110px;line-height: 100px;width:200px;" data-provides="fileinput">';
                ////如果是视频文件
                res += '<video ng-if="isVideo" controls="controls" oncontextmenu="return false;"  id="{{result}}" style="width:200px;height:110px;">';
                res+=  '<source ng-src="{{result}}">';
                res+=  '</video>';
                ////如果不是视频文件
                res += '<img ng-if="!isVideo" ng-click="popup($event)" alt="gallery 3" style="max-height:110px;max-width:200px;width:100%; height:100%;" class="img-responsive  img-{{shape}}" src ="'+ attrs.src +'" ng-src="{{result}}"/>';
                res += '</div>';
                res += '<span class="btn btn-default btn-file" style="padding: 3px 10px;">';
                res += '<span class="fileinput-new">';
                res += '选择文件';
                res += '</span>';
                if (!attrs.isCrop) {
                    res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().change()">';
                } else {
                    res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().crops()">';
                }
                res += '</span>';
                return res;
            },
            // replace: true,
            restrict: 'AE',
            scope: {
                width: '@',
                height: '@',
                maxSize: '@',
                top: '@',
                tops: '@',
                uploadSize: '@',
                callback:"&",
                result: '=',
                res:'=',
                // init: '&',
                // token: '=',
                // link: '=',
                key: "=",
                progress: "=",
                fileId:'@',
                filetype:'@',//自定义上传图片类型 设定格式 如：data-filetype="png,jpg" ，多种类型用逗号隔开，默认的时候可以不写data-filetype
            },
            link: function(scope, element, attributes) {
                if(scope.result!=""){
                    var filetype=scope.result.split("?id=")[1];
                    $timeout(function(){
                        filetype==2?scope.isVideo=true:scope.isVideo=false;
                    },50);
                }
                var Qiniu_UploadUrl = IMAGE_UPLOAD.url;
                var put64Url = IMAGE_UPLOAD.baseUrl;
                var houzitype='?id=1';
                scope.token = IMAGE_UPLOAD.token;
                scope.link = IMAGE_UPLOAD.link;
                scope.shape = scope.shape || 'square';
                scope.show = true;
                scope.isVideo=false;
                var data = {};
                data.width = scope.width;
                data.height = scope.height;
                data.maxSize = scope.maxSize;
                data.top = scope.top;
                data.tops = scope.tops;
                // console.log("scope", scope);
                scope.change = function() {
                    if(scope.callback){
                      scope.callback({data:{
                         time:1
                      }});
                    }
                    scope.res=false;
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var size = (file.size)/1024/1024;
                    if(size>3){
                        toastr.error('文件大小不超过3M', '', {});
                        scope.res=true;
                        return false;
                    }
                    var name = file.name;
                    var houzhui = name.substring(name.lastIndexOf('.') + 1);
                    var flagtype=false;
                    if(houzhui=='mp4'||houzhui=='3gp'||houzhui=='bmp'||houzhui=='jpg'||houzhui=='png'){
                        flagtype=true;
                    }
                    if(!flagtype){
                        toastr.error('文件类型错误', '', {});
                        scope.res=true;
                        return false;
                    }
                    if(houzhui!="mp4"||houzhui!="3gp"){
                        scope.isVideo=false;
                        houzitype='?id=1';
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", updateProgress);
                    xhr.open('POST', Qiniu_UploadUrl, true);
                    var formData;
                    formData = new FormData();
                    formData.append('token', scope.token);
                    formData.append('file', file);
                    //toastr.error('正在上传文件，请稍等...', '', {});
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var res = eval("(" + xhr.responseText + ")");
                            if(houzhui=="mp4"||houzhui=="3gp"){
                                houzitype='?id=2';
                                $timeout(function(){
                                    scope.isVideo=true;
                                },50);
                                scope.result = scope.link + res.key+houzitype;
                                scope.res=true;
                                scope.$apply();
                            }else{
                                var image = new Image();
                                image.src = scope.link + res.key;
                                image.onload = function(){
                                    if(image.width<scope.width||image.height<scope.height){
                                        toastr.error('图片分辨率不可小于750*562', '', {});
                                        scope.res=true;
                                        return false;
                                    }
                                    else{
                                        scope.result = scope.link + res.key+houzitype;
                                        scope.res=true;
                                        scope.$apply();
                                    }
                                }
                            }
                            scope.key = angular.copy(res.key);
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
                scope.crops = function() {
                    data.token = scope.token;
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var name = file.name;
                    var houzhui = name.substring(name.lastIndexOf('.') + 1);
                    var flag=true;
                    if(typeof scope.filetype=="undefined"){
                        if((houzhui=='png')||(houzhui=='PNG')||(houzhui=='jpg')||(houzhui=='JPG')||(houzhui=='gif')||(houzhui=='GIF')) {
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
                    if (typeof file != "undefined") {
                        $uibModal.open({
                            templateUrl: 'public/plugins/angular-image-upload/modal/crop.html',
                            controller: 'cropCtrl',
                            resolve: {
                                datas: function() {
                                    return angular.copy(data);
                                },
                                file: function() {
                                    return file;
                                }
                            }
                        }).result.then(function(result) {
                            if (result == "backdrop click" || result == "normal") {} else {
                                console.log(scope.link);
                                scope.result = scope.link + result;
                                // scope.result = scope.link + result;
                                scope.key = angular.copy(result);
                                console.log(scope.result);
                                console.log(scope.key);
                                angular.element("#" + attributes.fileId).val("");
                            }
                        }, function(reason) {
                            console.log(reason); //点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
                        });
                    }

                };
                scope.popup = function($event) {
                    if($event.target.src.indexOf('img/image-180.png')!=-1){
                      return ;
                    }
                    $.magnificPopup.open({
                        items: {
                            src: $event.target.src
                        },
                        type: "image",
                        mainClass: "mfp-fade"
                    });
                };
            }
        };
    });

angular.module('angular-image-upload', ['ui.bootstrap', 'ImageCropper','util.constant'])
    .directive("imageUpload", function($document,toastr, $uibModal,IMAGE_UPLOAD) {
        return {
            template: function(elem, attrs) {
                var res = '';
                if (attrs.multiple) {
                    res += '<div ng-show="show">';
                    res += '<span class="btn btn-default btn-file">';
                    res += '<span class="fileinput-new">';
                    res += '  选择图片';
                    res += '</span>';
                    if (!attrs.isCrop) {
                        res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().multiUpload()">';
                    } else {
                        res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().multiCropUpload()">';
                    }
                    res += '</span>';
                    res += '</div>';
                    res += '<div class="form-group">';
                    res += '<label class="col-sm-2 control-label"></label>';
                    res += '<div class="col-sm-10" style="margin-left:105px;margin-top:-12px;height:auto">';
                    res += '<div class="portfolioContainer grid">';
                    res += '<figure style="width:20%;height:20%" class="animal effect-sadie" ng-repeat="img in result track by $index">';
                    res += '<img style="width:100%;min-height: 80px;object-fit: cover;" ng-src="{{img}}" src="'+ attrs.src +'" alt="{{$index}}" />';
                    res += '<figcaption ng-click="popup(img)">';
                    res += '<p style="margin-left:11%">';
                    res += '<button type="button" class="btn btn-danger" ng-click="deleteImage($index,$event)" style="margin-left:-20px;">删除</button>';
                    res += '</p>';
                    res += '</figcaption>';
                    res += '</figure>';
                    res += '</div>';
                    res += '</div>';
                    res += '</div>';
                } else {
                    res += '<div class="fileinput fileinput-new" data-provides="fileinput">';
                    res += '<div class="fileinput-new">';
                    res += '<img alt="非必填项" class="img-responsive  img-{{shape}}" src ="'+ attrs.src +'" ng-src="{{result}}"/>';
                    res += '</div>';
                    res += '<div style="padding-top:10px;text-align:center;">';
                    /*  if (attrs.isCrop) {
                     res += '<div ng-click="crop()" style="padding-top:10px;">';
                     } else {
                     res += '<div style="padding-top:10px;">';
                     }*/
                    res += '<span class="btn btn-default btn-file">';
                    res += '<span class="fileinput-new">';
                    res += '  选择图片';
                    res += '</span>';
                    if (!attrs.isCrop) {
                        res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().change()">';
                    } else {
                        res += '<input type="file" name="..." id="{{fileId}}" onchange="angular.element(this).scope().crops()">';
                    }
                    res += '</span>';
                    res += '</div>';
                    res += '<div style="color:red">';
                    //这里在文件上传按钮下方提供文字提示说明
                    //if(typeof attrs.fileTips=="undefined"){
                    //    res += '*图片上传类型为：jpg、png、jpeg、bmp、gif';
                    //}else{
                    //    res += '*图片上传类型为：'+attrs.fileTips;
                    //}
                    res += '</div>';
                    res += '</div>';
                }
                return res;
            },
            // replace: true,
            restrict: 'AE',
            scope: {
                width: '@',
                height: '@',
                maxSize: '@',
                shape: '@',
                top: '@',
                tops: '@',
                uploadSize: '@',
                result: '=',
                crop: '&',
                // init: '&',
                // token: '=',
                // link: '=',
                key: "=",
                progress: "=",
                fileId:'@',
                filetype:'@',//自定义上传图片类型 设定格式 如：data-filetype="png,jpg" ，多种类型用逗号隔开，默认的时候可以不写data-filetype
            },
            link: function(scope, element, attributes) {
                var Qiniu_UploadUrl = IMAGE_UPLOAD.url;
                var put64Url = IMAGE_UPLOAD.baseUrl;
                scope.token = IMAGE_UPLOAD.token;
                scope.link = IMAGE_UPLOAD.link;
                //console.log(scope.token);
                if (attributes.multiple) {
                    scope.result = [];
                }
                scope.shape = scope.shape || 'square';
                scope.show = true;
                var data = {};
                data.width = scope.width;
                data.height = scope.height;
                data.maxSize = scope.maxSize;
                data.top = scope.top;
                data.tops = scope.tops;
                data.msg = "请使用清晰的图片进行裁切，图片模糊是由于图片尺寸不符合尺寸要求";
                data.shape = scope.shape;
                // console.log("scope", scope);
                scope.change = function() {
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var size = (file.size)/1024/1024;
                    if(size>5){
                        toastr.error('文件大小不超过5M', '', {});
                        return false;
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", updateProgress);
                    xhr.open('POST', Qiniu_UploadUrl, true);
                    var formData, startDate;
                    formData = new FormData();
                    formData.append('token', scope.token);
                    formData.append('file', file);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var res = eval("(" + xhr.responseText + ")");
                            scope.result = scope.link + res.key;
                            console.log(scope.result);

                            scope.key = angular.copy(res.key);
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
                scope.crop = function() {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'public/plugins/angular-image-upload/modal/crop.html',
                        controller: 'cropCtrl',
                        resolve: {
                            datas: function() {
                                return angular.copy(data);
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        if (result == "" || result == null || result == "normal") {} else {
                            scope.result = result;
                            angular.element("#" + attributes.fileId).val("");
                        }
                    }, function(reason) {
                        console.log(reason); //点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
                    });
                };

                scope.multiCrop = function() {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'public/plugins/angular-image-upload/modal/crop.html',
                        controller: 'cropCtrl',
                        resolve: {
                            datas: function() {
                                return angular.copy(data);
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        if (result == "" || result == null || result == "normal") {} else {
                            scope.pushImage(result);
                            angular.element("#" + attributes.fileId).val("");
                        }
                    }, function(reason) {
                        console.log(reason); //点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
                    });
                };

                scope.multiCropUpload = function() {
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var modalInstance = $uibModal.open({
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
                    });
                    modalInstance.result.then(function(result) {
                        if (result == "backdrop click" || result == "normal") {} else {
                            scope.pushImage(result);
                            angular.element("#" + attributes.fileId).val("");
                        }
                    }, function(reason) {
                        console.log(reason); //点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
                    });
                };

                scope.multiUpload = function() {
                    var file = new AV.File('crop.jpeg', angular.element(document).find("#" + attributes.fileId)[0].files[0]);
                    file.save().then(function(obj) {
                        scope.pushImage(obj.attributes.url);
                        angular.element("#" + attributes.fileId).val("");
                    }, function(err) {}).catch(function(error) {});

                };

                scope.pushImage = function(image) {
                    scope.result.push(image);
                    if (!attributes.isCrop)
                        scope.$apply();
                    if (scope.uploadSize) {
                        if (scope.result.length < scope.uploadSize) {
                            scope.show = true;
                            if (!attributes.isCrop)
                                scope.$apply();
                        } else {
                            scope.show = false;
                            if (!attributes.isCrop)
                                scope.$apply();
                        }
                    }
                };
                scope.deleteImage = function(index, event) {
                    event.stopPropagation();
                    scope.result.splice(index, 1);
                    if (scope.uploadSize) {
                        if (scope.result.length < scope.uploadSize) {
                            scope.show = true;
                        } else {
                            scope.show = false;
                        }
                    }
                };
                scope.popup = function(img) {
                    $.magnificPopup.open({
                        items: {
                            src: img
                        },
                        type: 'image',
                        mainClass: 'mfp-fade'
                    });
                };
                scope.crops = function() {
                    data.token = scope.token;
                    var file = angular.element(document).find("#" + attributes.fileId)[0].files[0];
                    var name = file.name;
                    var houzhui = name.substring(name.lastIndexOf('.') + 1);
                    var flag=true;
                    if(typeof scope.filetype=="undefined"){
                        if((houzhui=='png')||(houzhui=='PNG')||(houzhui=='JPEG')||(houzhui=='jpeg')||(houzhui=='jpg')||(houzhui=='JPG')||(houzhui=='BMP')||(houzhui=='bmp')||(houzhui=='gif')||(houzhui=='GIF')) {
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
                        toastr.error('文件选择类型错误', 'Warning', {});
                        return false;
                    }
                    // console.log("data",data);
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
                scope.dataURLToBase64 = function(base64) {
                    if (base64.split(',')[0] && base64.split(',')[0].indexOf('base64') >= 0) {
                        base64 = base64.split(',')[1];
                    }
                    return base64;
                };
                scope.qiNiuUpload = function(file) {
                    var xhr = new XMLHttpRequest();
                    var obj;
                    if (xhr.readyState == 4) {
                        var result = eval('(' + xhr.responseText + ')');
                        console.log("result", result);
                        return result.key;
                    } else {
                        return "error";
                    }
                    xhr.open("POST", put64Url, true);
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken " + scope.token);
                    xhr.send(dataURLToBase64(file));
                };
            }
        };
    });

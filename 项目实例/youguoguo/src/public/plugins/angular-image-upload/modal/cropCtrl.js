'use strict';
//大图片裁切
angular.module('angular-image-upload').controller('cropCtrl', ['$scope', '$uibModal', '$uibModalInstance', '$timeout',  'datas','file', function($scope, $modal, $modalInstance, $timeout, datas,file) {
    var open = "animated fadeInDown";
    var close = "animated fadeOutUp";
    var position = "topRight";
    var text = "";
    var data = {};
    $scope.width = datas.width;
    $scope.height = datas.height;
    $scope.maxSize = datas.maxSize;
    $scope.msg = datas.msg;
    $scope.url = datas.url;
    $scope.shape = datas.shape
    $scope.token = datas.token;
    var width = 0;
    var needWidth = datas.width * 2 + 470;
    // console.log(file);
    $timeout(function() {
        width = document.getElementById("modal").offsetWidth;
        if (needWidth > width) {
            $('.modal-footer').css("top", datas.tops + "px");
        } else {
            $('.modal-footer').css("top", datas.top + "px");
        }
        $scope.fileChanged();
    });

    //$(window).resize(function() {
    //    var widths = document.getElementById("modal").offsetWidth;
    //    if (needWidth > widths) {
    //        $('.modal-footer').css("top", datas.tops + "px");
    //    } else {
    //        $('.modal-footer').css("top", datas.top + "px");
    //    }
    //});
    var dataURLToBase64 = function(base64) {
        if (base64.split(',')[0] && base64.split(',')[0].indexOf('base64') >= 0) {
            base64 = base64.split(',')[1];
        }
        return base64;
    };
    $scope.fileChanged = function() {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function() {
            $scope.imgSrc = this.result;
            $scope.$apply();
        };
    };

    /*$scope.fileChanged = function(e) {
     var files = e.target.files;
     var fileReader = new FileReader();
     fileReader.readAsDataURL(files[0]);
     fileReader.onload = function(e) {
     $scope.imgSrc = this.result;
     $scope.$apply();
     };
     };*/
    $scope.clear = function() {
        $scope.imageCropStep = 1;
        delete $scope.imgSrc;
        delete $scope.result;
        delete $scope.resultBlob;
    };
    $scope.callback = function callback(result) {
        if (result.code == "200") {
            $modalInstance.close(result.data.homeImage);
            // pageService.noty(text, open, close, position);
        } else {
            // pageService.serverError(result);
        }
    };
    $scope.close = function() {
        $modalInstance.close("normal");
    };
    $scope.submit = function() {
        if ($scope.result == null) {} else {
            var url = "http://up.qiniu.com/putb64/-1";
            var xhr = new XMLHttpRequest();
            var obj;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var result = eval('(' + xhr.responseText + ')');
                    $modalInstance.close(result.key);
                } else {
                    // $modalInstance.close("error");
                }
            }

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.setRequestHeader("Authorization", "UpToken " + $scope.token);
            xhr.send(dataURLToBase64($scope.result));
            /*var file = new AV.File('crop.jpeg', {
             base64: $scope.result
             });
             file.save().then(function(obj) {
             datas.value = obj.url();
             if (datas.url == null) {
             $modalInstance.close(obj.attributes.url);
             } else {

             }
             }, function(err) {}).catch(function(error) {});*/
        }
    };
}]);

(function() {
    'use strict';

    angular.module('BlurAdmin.pages')
        .controller('RichTextCtrl', RichTextCtrl);
    function RichTextCtrl($scope, IMAGE_UPLOAD) {
        $scope.editor = {};
        // $scope.text = 'hello word <img src="http://ac-41DNzRW4.clouddn.com/3a821f6eedd19261f1a5.jpg" style="width: 1595px;"> ';
        $scope.options = {
            toolbar: [
                ["style", ["style"]],
                ["style", ["bold", "italic", "underline", "clear"]],
                ["fontsize", ["fontsize"]],
                ["color", ["color"]],
                ["para", ["paragraph"]],
                ["height", ["height"]],
                ["picture", ["picture"]],
                ["link", ["link"]],
                ["table", ["table"]],
                ['view', ['codeview']],
            ]
        };

        $scope.init=function() {
            $(".note-picture").click(function(){
                angular.element(".modal-backdrop").remove();
            });
            $(".note-link").click(function(){
                angular.element(".modal-backdrop").remove();
            });
        }

        $scope.imageUpload=function(files) {
            var file = files[0];
            var Qiniu_UploadUrl = IMAGE_UPLOAD.url;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', Qiniu_UploadUrl, true);
            var formData;
            formData = new FormData();
            formData.append('token', IMAGE_UPLOAD.token);
            formData.append('file', file);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var res = eval("(" + xhr.responseText + ")");
                    $scope.editor.element.summernote('editor.insertImage', IMAGE_UPLOAD.link + res.key);
                }
            };
            xhr.send(formData);
        }
    }
})();
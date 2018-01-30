(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('feedbackeditCtrl', feedbackeditCtrl);

    function feedbackeditCtrl($scope, $state,apiRequest,$uibModalInstance,modal,toastr) {
        $scope.replyContext="";
        console.log(123)
        console.log(modal)
        $scope.reply=function(){
            apiRequest.post('/admin/feedback/replyFeedback', {id:modal.params.id,replyContext:$scope.replyContext}, function(res) {
                if (res.code == "200") {
                    toastr.success('回复成功');
                    $uibModalInstance.close("success");
                    $state.reload();
                } else {
                    toastr.error(res.message, '');
                    $scope.$apply();
                }
            });
        }


    }

})();
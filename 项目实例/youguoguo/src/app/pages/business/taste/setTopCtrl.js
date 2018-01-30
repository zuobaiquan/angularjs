/**
 * created by yuxiaojing on 2017-7-26
 * 体验管理置顶功能需要弹出弹窗选择类型
 */


(function() {
    'use strict';
    angular.module('BlurAdmin.pages.business')
        .controller('setTopCtrl', setTopCtrl);

    /** @ngInject */
    function setTopCtrl($scope,apiRequest,modal,toastr,$uibModalInstance) {
    	$scope.typeList = modal.item.projectTypeList;
    	$scope.typeId = null;
    	$scope.typeList.splice(0,0,{id:null,name:'选择置顶类型'})

    	$scope.submit = function(){
    		apiRequest.post('/admin/project/topProject', { id:modal.item.id,typeId:$scope.typeId }, function (res) {
                if (res.code == "200") {
                    toastr.success('置为置顶成功！');
                } else {
                    toastr.error(res.message, '');
                }
                $uibModalInstance.close();
                
            },function(err){
                toastr.error(err.message, '');
                    return ;
            });
    	}


    }

})();
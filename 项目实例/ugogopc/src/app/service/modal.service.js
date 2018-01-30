(function() {
    'use strict';

    angular.module('BlurAdmin.service')
        .factory('modalsService', modalService);

    /** @ngInject */
    function modalService($uibModal,toastr,$timeout, API_URL,$q) {
        var base_url = API_URL;
        var tipModal = function(modal){
            $uibModal.open({
                templateUrl: "app/pages/modal/tipModal.html",
                controller: "ModalCtrl",
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            });
        };
        var tipcallbackModal = function(modal,back){
            $uibModal.open({
                templateUrl: "app/pages/modal/tipModal.html",
                controller: "ModalCtrl",
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            }).result.then(function(){
                back();
            });
        };
        var normalModal = function(page,ctrl,modal,back){
            $uibModal.open({
                templateUrl: page,
                controller: ctrl,
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            }).result.then(function(){
                back();
            });
        };

        var edittimeSet=function(page,ctrl,modal,back){
            $uibModal.open({
                templateUrl: 'app/pages/service/taste/addtime_tpl.html',
                controller: ctrl,
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            }).result.then(function(result){
                back(result);
            });
        }
        var deletevideoItem=function(index,arr){
            var arrId=[];
            var isempty=false;
            var isdelete=false;
            for(var i=0;i<arr.length;i++){
                if((arr[i].url=="")){
                    isempty=true;
                    arrId.push(i);
                }
            }
            if(isempty){
                for(var j=0;j<arrId.length;j++){
                    if(index==arrId[j]){
                        isdelete=true;
                    }
                }
                if(isdelete){
                    arr.splice(index,1);
                    return ;
                }
                else{
                    toastr.error("请先删除空白项", '');
                    return;
                }
            }
            if(arr.length<=1){
                return ;
            }
            arr.splice(index,1);
        }
        var clearOption=function(){
            $timeout(function(){
                for(var i=0;i<angular.element("body").find("option:selected").length;i++){
                    if(angular.element("body").find("option:selected")[i].label==''){
                        angular.element("body").find("option:selected")[i].remove('option');
                    }
                }
            },50);
        }
        var checkStepinput=function(arr){
            for(var i=0;i<arr.length;i++){
                if(arr[i].isright){
                    return true;
                    break;
                }
                else{
                    continue;
                }
            }
            return false;
        }

        return {
            tip: tipModal,
            callback:tipcallbackModal,
            normal:normalModal,
            edittimeset:edittimeSet,
            deletevideoItem:deletevideoItem,
            clearOption:clearOption,
            checkStepinput:checkStepinput
        }

    }
})();

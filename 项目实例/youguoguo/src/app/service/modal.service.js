(function() {
    'use strict';

    angular.module('BlurAdmin.service')
        .factory('modalsService', modalService);

    /** @ngInject */
    function modalService($uibModal, API_URL,$q) {
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
      return {
            tip: tipModal,
            callback:tipcallbackModal,
            normal:normalModal
      }

    }
})();

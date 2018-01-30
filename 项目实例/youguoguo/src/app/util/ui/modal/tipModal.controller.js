/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function() {
    'use strict';

    angular.module('util.ui.modal')
        .controller('TipModalCtrl', TipModalCtrl);

    /** @ngInject */
    function TipModalCtrl($scope, httpService, $uibModalInstance, toastr, modal) {
      var vm = this;
      vm.disable = false;
      vm.modal = modal;
      vm.submit = submit;
        function submit() {
            vm.disable = true;
            httpService.postForm(modal.url, modal.params).then(function(res){
              toastr.success(modal.success);
              $uibModalInstance.close("success");
            }).catch(function(error){
              vm.disable = false;
              if (error.code)
                      toastr.error(error.message, "错误信息");
                  else
                      toastr.error("服务器请求错误，请再次尝试", "错误信息");
            });
        }
    }


})();

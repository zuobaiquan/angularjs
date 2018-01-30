/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function() {
    'use strict';

    angular.module('util.ui.modal')
        .controller('backModalCtrl', backModalCtrl);

    /** @ngInject */
    function backModalCtrl($scope, apiRequest, $uibModalInstance, $state, modal) {
        var vm = this;
        vm.disable = false;
        vm.modal = modal;
        vm.submit = submit;
        console.log("modal",vm.modal);


        function submit() {
            vm.disable = true;
            $uibModalInstance.close("success");
            if (vm.modal.params)
                $state.go(vm.modal.url, vm.modal.params);
            else
                $state.go(vm.modal.url);
        }
    }


})();

/**
 * Created by xingfinal on 16/12/28.
 */
(function () {
  'use strict';

  angular
    .module('util.ui.modal')
    .controller('ErrorModal', ErrorModal);

  /* @ngInject */
  function ErrorModal(data) {
    var vm = this;
    vm.error = '';
    vm.$onInit = onInit;

    function onInit() {
      vm.error = data;
    }
  }

})();


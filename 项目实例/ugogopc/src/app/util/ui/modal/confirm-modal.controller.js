/**
 * Created by xingfinal on 16/12/28.
 */
(function () {
  'use strict';

  angular
    .module('util.ui.modal')
    .controller('ConfirmModal', ConfirmModal);

  /* @ngInject */
  function ConfirmModal(data) {
    var vm = this;
    vm.title = 'ConfirmModal';
    vm.tip = '';
    vm.$onInit = onInit;

    function onInit() {
      vm.tip = data;
    }
  }

})();


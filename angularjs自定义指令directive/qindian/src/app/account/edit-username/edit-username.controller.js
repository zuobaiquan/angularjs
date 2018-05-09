(function () {
  'use strict';

  angular
    .module('starter.account')
    .controller('EditUsernameCtrl', EditUsernameCtrl)

  /** @ngInject */
  function EditUsernameCtrl(applyApi, locationService, $ionicPopup, $ionicHistory) {
    var vm = this;

    vm.master = {};
    vm.user = {};
    vm.editName = edit;
    var inputEle;
    vm.reset = function ($event) {
      inputEle = angular.element($event.target).next();
      inputEle = inputEle[0];
      inputEle.value = '';
    };

    _getAccountInfo();

    function edit() {
      if (!vm.user.nickname || inputEle.value === '') {
        showAlert('昵称不能为空');
        return;
      }
      applyApi.post('me/update', vm.user,
        function (rel) {
          showAlert('修改成功');
          $ionicHistory.goBack(-1);
        },
        function () {
          showAlert('修改失败');
          $ionicHistory.goBack(-1);
        }
      );
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: type
      });
    }

    function _getAccountInfo() {
      applyApi.post('me/info', {},
        function (rel) {
          vm.user.nickname = rel.data.nickname;
        },
        function () {
          console.log('获取用户信息错误');
        });
    }
  }
}());

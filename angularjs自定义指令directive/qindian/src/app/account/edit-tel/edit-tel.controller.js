(function () {
  'use strict';

  angular
    .module('starter.account')
    .controller('EditTelCtrl', EditTelCtrl)

  /** @ngInject */
  function EditTelCtrl($interval, applyApi, $ionicHistory,$ionicPopup) {
    var vm = this;
    var timeout;

    vm.params = {
      phone: '',
      code: ''
    }
    vm.reGetTime = 0;
    vm.getSecurity = getSecurity
    vm.bindPhone = bindPhone
    vm.back = back

    function getSecurity() {
      applyApi.post('me/send-sms-code', vm.params,
        function (rel) {
          vm.reGetTime = 60;
          timeout = $interval(function () {
            vm.reGetTime -= 1;
          }, 1000, 60)
          showAlert('验证码发送成功，请注意查收');
        },
        function () {
          showAlert('获取验证码失败')
          console.log('error')
        }
      )
    }

    // tel: 12344
    // 741331
    function bindPhone() {
      if (vm.params.code === '') {
        showAlert('验证码不能为空')
        return
      }
      applyApi.post('me/bind-phone', vm.params,
        function (rel) {
          showAlert('绑定成功')
          $ionicHistory.goBack(-1);
        },
        function () {
          showAlert('绑定失败')
          console.log('error')
        }
      )
    }

    function back() {
      $ionicHistory.goBack(-1);
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: type
      });
    }

  }

})();

(function () {
  'use strict';

  angular
    .module('starter.account')
    .controller('AccountCtrl', AccountCtrl)

  /** @ngInject */
  function AccountCtrl(applyApi, AuthService, $ionicPopup, QINIU_LINK) {
    var vm = this;

    vm.accountBase
    vm.logout = logout
    vm.setAvatar = setAvatar;
    vm.QINIU_LINK = QINIU_LINK;
    getAccountInfo()

    function getAccountInfo() {
      applyApi.post('me/info', {},
        function (rel) {
          vm.accountBase = rel.data
          vm.accountBase.avatar = vm.accountBase.account.avatar.replace(/http:\/\//i, '');
          console.log('用户信息', vm.accountBase)
        },
        function () {
          console.log('food error')
        })
    }

    function logout() {
      showConfirm('是否要退出登录');

    }

    function setAvatar() {
      var params = {}
      AuthService.chooseImage(1, function (data) {
        params.avatar = data
        applyApi.post('me/update', params,
          function (rel) {
            vm.accountBase.avatar = data.replace(/http:\/\//i, '');
            showAlert('头像修改成功');
          },
          function () {
            showAlert('更换头像失败')
          })
      })
    }

    function showAlert(type) {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: type
      });
    }

    // 一个确认对话框
    function showConfirm(tip) {
      var confirmPopup = $ionicPopup.confirm({
        title: '提示',
        template: tip,
        buttons: [{
            text: '确定',
            type: 'button-positive',
            onTap: function (e) {
              WeixinJSBridge.invoke('closeWindow');
              AuthService.removeToken();
            }
          },
          {
            text: '取消',
            onTap: function (e) {
            }
          },
        ]
      });
    }
  }

}());

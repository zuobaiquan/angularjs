/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      controller: ['adminService', '$scope','modalService', 'DOMAIN', '$window', function (adminService, $scope,modalService, DOMAIN, $window) {
        $scope.profilePicture = "assets/img/app/woniulogo.png";
        $scope.ugogologo=adminService.getAdmin().admin.avatar;
        $scope.signOut = function () {
          adminService.removeAdmin();
          $window.location.href = DOMAIN + '/auth.html';
        };
        $scope.resetPass = function(){
            console.log('修改密码')
            var page = 'app/pages/system/user/resetpass.html',
                ctrl = 'resetPswdCtrl',
                modal = {
                    title:'修改管理员密码',
                    success: '修改密码成功',
                    url:'/pub/admin/edit-password',
                    //adminId:
                };
            modalService.editModal(ctrl, page, modal).then(function(result) {
                $scope.signOut()
            })
        };
      }]
    };
  }

})();

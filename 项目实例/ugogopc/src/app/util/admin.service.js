/**
 * Created by xingfinal on 16/12/26.
 */
(function () {
    'use strict';

    angular
        .module('util.admin', [])
        .factory('adminService', adminService);

    /* @ngInject */
    function adminService($window) {
        var ADMIN = 'ADMIN';
        var service = {
            getAdmin: getAdmin,
            removeAdmin: removeAdmin,
            getIndex: getIndex
        };
        return service;

        function getAdmin() {
            return JSON.parse($window.sessionStorage.getItem(ADMIN));
        }

        function removeAdmin() {
            $window.sessionStorage.removeItem(ADMIN);
        }

        function getIndex(){
            $scope.menus = getAdmin().menus;
            if($scope.menus[0].subMenu === null){
                $window.sessionStorage.setItem("index",$scope.menus[0].stateRef);
                return $scope.menus[0].stateRef;
            }else{
                $window.sessionStorage.setItem("index",$scope.menus[0].subMenu[0].stateRef);
                return $scope.menus[0].subMenu[0].stateRef;
            }
        }
    }

})();

/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', BaSidebarCtrl);

    /** @ngInject */
    function BaSidebarCtrl($scope, $state, adminService, baSidebarService) {
        //$scope.menuItems = adminService.getAdmin();
        //父级菜单
        var fatherMenu=adminService.getAdmin().level1Map;
        var childMenu=adminService.getAdmin().level2Map;

        for(var item in childMenu){
            fatherMenu[item].subMenu=new Array();
            delete fatherMenu[item].updateTime;
            delete fatherMenu[item].isDelete;
            delete fatherMenu[item].isFather;
            delete fatherMenu[item].createTime;
            for(var i=0;i<childMenu[item].length;i++){
                fatherMenu[item].subMenu.push({
                    id:childMenu[item][i].id,
                    father:childMenu[item][i].father,
                    params:childMenu[item][i].params,
                    level:childMenu[item][i].level,
                    order:childMenu[item][i].sort,
                    title:childMenu[item][i].title,
                    stateRef:childMenu[item][i].stateRef,
                    subMenu:null
                });
            }
        }
        $scope.menuItems=new Array();
        for(var item in fatherMenu){
            fatherMenu[item].order=fatherMenu[item].sort;
            delete fatherMenu[item].sort;
            $scope.menuItems.push(fatherMenu[item]);
        }
        //console.log($scope.menuItems);

        $scope.menuItems.sort(function(a, b) {
            return a.sort - b.sort;
        })
        if ($scope.menuItems[0].subMenu[0] === null) {
            $scope.defaultSidebarState = $scope.menuItems[0].stateRef;
            $scope.defaultParams = $scope.menuItems[0].params;
        } else {
            $scope.defaultSidebarState = $scope.menuItems[0].subMenu[0].stateRef;
            $scope.defaultParams = $scope.menuItems[0].subMenu[0].params;
        }
        //console.log($scope.menuItems);
        $scope.ionStyle = {
            "margin-right": "10px"
        };
        $scope.subMenuStyle = {
            "padding-left": "42px",
            "line-height": "33px"
        };
        // console.log(angular.element(".ion-gear-a"));
        angular.element(".al-sidebar-list-link").find("i").css("margin-right", "10px");
        // if ($state.current.url === "^") {
        //     $state.go($scope.defaultSidebarState,eval('('+ $scope.defaultParams +')'));
        // }
        $scope.hoverItem = function($event) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 66;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.$on('$stateChangeSuccess', function() {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });
    }
})();
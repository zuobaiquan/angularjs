/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('contentTop', contentTop);

  /** @ngInject */
  function contentTop($location, $state,adminService) {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/contentTop/contentTop.html',
      link: function($scope) {
        $scope.show = true;
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
                  stateRef:childMenu[item][i].stateRef
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
        $scope.$watch(function() {
            $scope.activePageTitle = $state.current.title;
            for (var i = 0; i < $scope.menuItems.length; i++) {
              if($scope.menuItems[i].stateRef !== null)
                if ($scope.menuItems[i].stateRef.indexOf($state.current.name) > -1) {
                    $scope.show = false;
                    break;
                } else {
                    $scope.show = true;
                }
            }
        });


        $scope.back = function() {
            history.go(-1);
        };
      }
    };
  }

})();

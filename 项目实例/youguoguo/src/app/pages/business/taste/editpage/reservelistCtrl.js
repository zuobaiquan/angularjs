
(function () {
    'use strict';

angular.module('BlurAdmin.pages.business')
    .controller('reservelistCtrl', reservelistCtrl);

function reservelistCtrl($scope,toastr,modal) {
  var tempArr=[],newArr = [];
  $scope.reserveTimelist=[{month:'',child:[]}];
  $scope.reserveTimelist.shift();
  angular.forEach(modal.reserveDate, function (item) {
    tempArr.push(item.substr(0,7));
  });
  tempArr.forEach(function(item){
      if(newArr.indexOf(item) == -1){
          newArr.push(item);
      }
  });
  for(var kk=0;kk<newArr.length;kk++){
    $scope.reserveTimelist.push({
        month:newArr[kk],child:[]
    });
    for(var kkk=0;kkk<modal.reserveDate.length;kkk++){
       if(modal.reserveDate[kkk].substr(0,7)==newArr[kk]){
          $scope.reserveTimelist[kk].child.push(modal.reserveDate[kkk]);
       }
    }
  }
}

})();

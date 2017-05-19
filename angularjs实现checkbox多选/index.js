angular.module("myApp",[])  
.controller("mainCtrl", function ($scope) {  
    $scope.selectAll=false;  
    $scope.all= function (m) {  
        for(var i=0;i<$scope.persons.length;i++){  
          if(m===true){  
              $scope.persons[i].state=false;  
          }else {  
              $scope.persons[i].state=true;  
          }  
        }  
    };
    $scope.persons=[  
        {state:false},  
        {state:false},  
        {state:false},  
        {state:false}  
    ];
    $scope.isChecked=function(){
        console.log($scope.persons);
    }

});  
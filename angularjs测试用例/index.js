angular.module("myApp",[])  
.controller("mainCtrl", function ($scope) {  
    $scope.textdata="";

    $scope.$watch('textdata',function(newValue,oldValue){
        console.log(newValue,oldValue);
        var text=newValue.split("\n");
        for(var j=0;j<text.length;j++){
            if(text[j].length>4){
                console.log("第"+(j+1)+"行",text[j]);
                text.splice(j,1);
            }
            if(text[j].length==0){
                console.log("第"+(j+1)+"行为空");
            }
        }
    });

});  
(function() {
    'use strict';
    angular.module('BlurAdmin.pages.system')
        .controller('powerModalCtrl', powerModalCtrl);

    /** @ngInject */
    function powerModalCtrl($scope, apiRequest,$state, $uibModalInstance, toastr, modal,$timeout) {
    	$scope.disable = false;
	    $scope.modal = modal;
	    $scope.submit = function(){
	    	var selected = $scope.basicTree.jstree(true).get_selected();
	      	$scope.disable = true;
            var selmenuid=[];
            for(var i=0;i<selected.length;i++){
                selmenuid.push(selected[i]);
            }
            selmenuid=selmenuid.join(",");
  	      	var params = {
  	      		roleId:modal.roleId,
              menuIds:selmenuid,
              name:modal.params.name,
              description:modal.params.description
  	      	}
	        if(selected.length){
	        	apiRequest.post(modal.url,params,function(res){
			        if(res.code == "200"){
			          toastr.success(modal.success);
                $state.reload();
			          $uibModalInstance.close("success");
			        }else{
			          toastr.error(res.message, '');
			          $scope.disable = false;
			          $scope.$apply();
			        }
			    });
	        }
	    };
	    $scope.expand = function () {
	      $scope.ignoreChanges = false;
	      modal.data.forEach(function (n) {
	        n.state.opened = true;
	      });
	      modal.config.version++;
	    };

	    $scope.collapse = function () {
	      $scope.ignoreChanges = false;
	      modal.data.forEach(function (n) {
	        n.state.opened = false;
	      });
	      modal.config.version++;
	    };

	    $scope.readyCB = function() {
	      $timeout(function() {
	        $scope.ignoreChanges = false;
	      });
	    };


	    $scope.applyModelChanges = function() {

	      return !$scope.ignoreChanges;
	    };
    }
})();

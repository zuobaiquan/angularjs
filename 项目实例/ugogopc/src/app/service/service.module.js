(function () {
  'use strict';

  angular.module('BlurAdmin.service', [
    // 'util.admin',
    // 'util.constant'
  ])
  .config(['$httpProvider',function($httpProvider) {
        //$http模块POST请求request payload转form data
        $httpProvider.defaults.transformRequest = function(obj) {
            var str = [];
            for (var p in obj) {
                if(obj[p] === null){
                    delete obj[p];
                }else{
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };

        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

	}]);

})();

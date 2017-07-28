'use strict'

// 修改$http的post请求为get请求
angular.module('app').config(['$provide', function($provide){
    $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
        var get = $delegate.get;
        $delegate.post = function(url, data, config) {
            var def = $q.defer();
            get(url).then(function(data){
                def.resolve(data);
            }).then(function(err){
                def.reject(err);
            });

            return {
                then: function(cb,errcb){
                    def.promise.then(cb,errcb);
                }
            }
        }
        return $delegate;
    }]);
}]);
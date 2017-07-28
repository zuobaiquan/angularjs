'use strict'

angular.module('app').controller('searchCtrl', ['$scope', '$http', '$q', 'fetchData', function ($scope, $http, $q,fetchData) {
    $scope.filterList = [{ id: 'city', name: '城市' }, { id: 'salary', name: '薪水' }, { id: 'scale', name: '公司规模' }];
    $scope.positionList = [];
    $scope.filterObj = {};
    $scope.sheet = {};

    function getPositionList() {
        var def = $q.defer();
        $http.get('data/positionList.json').then(function (resp) {
            def.resolve(resp.data);
        });
        return def.promise;
    }


    $scope.search = function () {
        var result = [];

        getPositionList().then(function (data) {
            if (!$scope.searchText) {
                $scope.positionList = data;
                return;
            }

            angular.forEach(data, function (item, index) {
                if (item.job.indexOf($scope.searchText) !== -1) {
                    result.push(item);
                } else if (item.companyName.indexOf($scope.searchText) !== -1) {
                    result.push(item);
                }
            });
            $scope.positionList = result;

        });
    }


    // 选择筛选项
    var tabId = '';
    $scope.selectFilter = function(id,name) {
        tabId = id;
        $scope.sheet.list = fetchData[id];
        $scope.sheet.show = true;
    };
    // 选择筛选列表项
    $scope.selectFilterItem = function (id, name) {
        getPositionList().then(function (data) {
            $scope.positionList = data;
        });
        if (id) {
            angular.forEach($scope.filterList, function (item) {
                if (item.id === tabId) {
                    item.name = name;
                }
            });
            $scope.filterObj[tabId + 'Id'] = id;
        } else {
            delete $scope.filterObj[tabId + 'Id'];
            angular.forEach($scope.filterList, function (item) {
                if (item.id === tabId) {
                    switch (item.id) {
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
            });
        }
    }
}]);
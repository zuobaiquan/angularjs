var app = angular.module('myApp',[]);
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function (s){return $window.btoa(unescape(encodeURIComponent(s)));},
    format = function (s,c){return s.replace(/{(\w+)}/g, function (m, p) {return c[p];})};
    return {
        tableToExcel:function (tableId, worksheetName) {
            var table = angular.element(document.querySelector(tableId));
            var ctx = { 
                worksheet: worksheetName, 
                table: table.html() 
            },
            href = uri + base64(format(template, ctx));
            return href;
        }
    };
});
app.controller('excelController', function ($scope, $http,Excel,$timeout) {
    //在table对应的controller里面添加方法：（调用之前要引用factory，$timeout）
    //导出excel
    $scope.exportToExcel = function(tableId) { 
        $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
        $timeout(function() { 
            location.href = $scope.exportHref; 
        }, 100);
    }
    $scope.testData = [
        {
            id: 2012001,
            name: 'zuobaiquan'
        },
        {
            id: 2013001,
            name: '测试2013001'
        },
        {
            id: 2014001,
            name: '测试2014001'
        },
        {
            id: 2015001,
            name: '测试2015001'
        }
    ];
});
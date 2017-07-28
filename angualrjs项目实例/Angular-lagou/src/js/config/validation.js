'use strict'

angular.module('app').config(['$validationProvider','$qProvider', function($validationProvider,$qProvider){
    var expression = {
        phone: /^1[\d]{10}$/,
        password : function(value) {
            var str = value + '';
            return str.length >= 6 && str.length <= 16;
        },
        code: /\d{4}/,
        required: function(value) {
            return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '请输入正确的手机号'
        },
        password: {
            success: '',
            error: '请输入6-16位密码'
        },
        code: {
            success: '',
            error: '验证码为四位数字'
        },
        required: {
            success: '',
            error: '此项不能为空'
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    $qProvider.errorOnUnhandledRejections(false);
}]);
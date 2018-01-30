(function() {
    'use strict';

    angular.module('BlurAdmin.service')
        .service('verify', function(toastr, toastrConfig) {
            var openedToasts = [];

            var defaultConfig = angular.copy(toastrConfig);
            var options = {
                autoDismiss: false,
                positionClass: 'toast-top-right',
                type: 'info',
                timeOut: '2000',
                extendedTimeOut: '2000',
                allowHtml: false,
                closeButton: true,
                tapToDismiss: true,
                progressBar: false,
                newestOnTop: true,
                maxOpened: 0,
                preventDuplicates: false,
                preventOpenDuplicates: false,
                title: "",
                msg: ""
            };

            this.tooltip = function(tip, type) {
                options.msg = tip;
                options.type = type;
                angular.extend(toastrConfig, options);
                openedToasts.push(toastr[options.type](options.msg, options.title));
            };
            this.verified = function(verifing) {
                var ver = false;
                for (var i = 0; i < verifing.length; i++) {
                    ver = this[verifing[i].fname](verifing[i].content, verifing[i].tip);
                    if (!ver) {
                        break;
                    }
                }
                return ver;
            };

            //验证手机号
            this.mobile = function(phone, tip) {
                var reg = '^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$';
                if (!phone.toString().match(reg)) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };
            // 折扣
            this.isDiscount = function(content, tip) {
                var reg = '^0\.[1-9]{0,2}$';
                content=content.toString();
                if (!content.toString().match(reg)) {
                    if(content==0||content==1){
                        return true
                    }else{
                        this.tooltip(tip, 'error');
                        return false;
                    }
                }else{
                    return true;
                }
            };
            //不为空
            this.isEmpty = function(content, tip) {
                if (content === '' || content === null || content === undefined) {
                    if (content === 0) {
                        return true;
                    } else {
                        this.tooltip(tip, 'error');
                        return false;
                    }
                } else {
                    return true;
                }
            };
            this.isUnstrictEmpty = function(content, tip) {
                if (content.length === 0) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //指定长度
            this.appointMaxLength = function(content, length) {
                if (content.length <= length) {
                    return true;
                } else {
                    return false;
                }
            };

            this.appointMinLength = function(content, length) {
                if (content.length >= length) {
                    return true;
                } else {
                    return false;
                }
            };

            //仅限汉字
            this.onlyChinese = function(content, tip) {
                var reg = '^[\u2E80-\u9FFF]+$';
                if (!content.match(reg)) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //仅限数字
            this.onlyNum = function(content, tip) {
                var reg = new RegExp('^[0-9]*$');
                if (!reg.test(content)) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //判断日期格式是否小于当前日期
            this.datejudge = function(selDay, tip) {
                var nowTemp = new Date();
                var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                if (selDay > nowDay) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //判断内容是否一样
            this.isSame = function(content, tip) {
                var con = content.split(';');
                if (con[1] === con[0]) {
                    return true;
                } else {
                    this.tooltip(tip, 'error');
                    return false;
                }
            };

            //邮箱
            this.isEmail = function(email, tip) {
                var reg = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
                if (!reg.test(email)) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //qq号可以为手机号，邮箱，QQ号
            this.isQQ = function(qq, tip) {
                var reg1 = new RegExp('^[0-9]*$');
                var reg2 = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
                if (reg1.test(qq) && reg2.test(qq)) {
                    return true;
                } else {
                    this.tooltip(tip, 'error');
                    return false;
                }
            };

            //金额，可接收正整数,也可接收正浮点数，两位小数
            this.isMoney = function(content, tip) {
                var reg = new RegExp('^(([1-9]*)|([0]{1}))?((\.)?([0-9]{1,2}))?$');
                if (!reg.test(content) || content <= 0) {
                    this.tooltip(tip, 'error');
                    return false;
                } else {
                    return true;
                }
            };

            //指定范围 content +'; 1-100'
            this.region = function(content, tip) {
                var con = content.split(';');
                var middle = +con[0],
                    min = +con[1].split('-')[0],
                    max = +con[1].split('-')[1];
                if (middle >= min && middle <= max) {
                    return true;
                } else {
                    this.tooltip(tip, 'error');
                    return false;
                }
            };

            //至少一个不为空
            this.allEmpty = function(content, tip) {
                var con = content.split(';');
                console.log(con);
                var verifed = false;
                for (var i = 0; i < con.length; i++) {
                    if (con[i] && con[i] !== 'null' && con[i] !== 'undefined' && con[i] !== 0) {
                        console.log(con[i]);
                        verifed = true;
                        break;
                    } else {
                        verifed = false;
                    }
                }
                if (!verifed) {
                    this.tooltip(tip, 'error');
                }
                return verifed;
            };
        })
        .directive('onlyChinese', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        var reg = '^[\u2E80-\u9FFF]+$';
                        if (value) {
                            if (!value.match(reg)) {
                                mCtrl.$setValidity('onlyChinese', false); //注意到这里设置为false，而$error.charE则会显示为true
                            } else {
                                mCtrl.$setValidity('onlyChinese', true);
                            }
                        } else {
                            mCtrl.$setValidity('onlyChinese', true);
                        }

                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        })
        .directive('onlyNum', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        var reg = new RegExp('^[0-9]*$');
                        if (value) {
                            if (!value.match(reg)) {
                                mCtrl.$setValidity('onlyNum', false);
                            } else {
                                mCtrl.$setValidity('onlyNum', true);
                            }
                        } else {
                            mCtrl.$setValidity('onlyNum', true);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        })
        .directive('isEmpty', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        console.log('value', value);
                        if (value === '' || value === null || value === undefined) {
                            if (value === 0) {
                                mCtrl.$setValidity('isEmpty', true);
                            } else {
                                mCtrl.$setValidity('isEmpty', false);
                            }
                        } else {
                            mCtrl.$setValidity('isEmpty', true);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        })
        .directive('onlyMobile', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        var reg = '^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$';
                        if (value) {
                            if (!value.match(reg)) {
                                mCtrl.$setValidity('onlyMobile', false);
                            } else {
                                mCtrl.$setValidity('onlyMobile', true);
                            }
                        } else {
                            mCtrl.$setValidity('onlyMobile', true);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        })
        //qq号可以为手机号，邮箱，QQ号
        .directive('onlyQq', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        var reg1 = new RegExp('^[0-9]*$');
                        var reg2 = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
                        if (value) {
                            if (reg1.test(value) || reg2.test(value)) {
                                mCtrl.$setValidity('onlyQQ', true);
                            } else {
                                mCtrl.$setValidity('onlyQQ', false);
                            }
                        } else {
                            mCtrl.$setValidity('onlyQQ', true);
                        }

                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
        });

})();

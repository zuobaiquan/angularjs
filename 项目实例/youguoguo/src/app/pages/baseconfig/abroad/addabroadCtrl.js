(function() {
    'use strict';


    angular.module('BlurAdmin.pages.baseconfig')
        .controller('addabroadCtrl',addabroadCtrl);
    function addabroadCtrl($scope,apiRequest,toastr,modal,IMAGE_UPLOAD,$uibModalInstance,modalsService) {
        var vm = this;
        vm.init = init;
        $scope.disable = false;
        $scope.modal = modal;
        $scope.submit = function(){
            $scope.disable = true;
            apiRequest.post(modal.url,modal.params,function(res){
                toastr.success(modal.success);
                $uibModalInstance.close("success");
            },function(err){
                toastr.error(err.message, '');
                $scope.disable = false;
            });
        };

        $scope.selCity=function(){
            if(angular.element("body").find("#showCityname").css("display")=='block'){
                angular.element("body").find("#showCityname").css({"display":"none"});
            }
            else{
                $scope.selValue('hot');
                angular.element("body").find("#showCityname").css({"display":"block"});
            }
        }

        $scope.selValue=function(index){
            if(index!='hot'){
                $scope.isHot=false;
                var arr=index.split('');
                $scope.allcityList=[];
                for(var j=0;j<index.length;j++){
                    $scope.list = $scope.abroadAll.filter(function(item) {
                        //console.log(item.name,arr[j]);
                        return item.name==arr[j];
                    });
                    $scope.allcityList.push($scope.list);
                }
            }
            else{
                $scope.isHot=true;
                $scope.allcityList = $scope.abroadAll.filter(function(item) {
                    return item.name==index;
                });
            }
        }

        $scope.selItemname=function(english,countryName){
            $scope.modal.params.countryName=countryName;
            $scope.modal.params.english=english;
            angular.element("body").find("#showCityname").css({"display":"none"});
        }


        $scope.abroadAll = [
            {
                name: "hot",
                abroads: [{english:'America',chinese:'美国'},{english:'Australia',chinese:'澳大利亚'},{english:'Brazil',chinese:'巴西'},{english:'Canada',chinese:'加拿大'},{english:'England',chinese:'英国'},{english:'France',chinese:'法国'},{english:'India',chinese:'印度'},{english:'Japan',chinese:'日本'},{english:'Russia',chinese:'俄罗斯'}]
            },
            {
                name: "A",
                abroads: [{english:'Angola',chinese:'安哥拉'},{english:'Afghanistan',chinese:'阿富汗'},{english:'Albania',chinese:'阿尔巴尼亚'},{english:'Algeria',chinese:'阿尔及利亚'},{english:'America',chinese:'美国'},{english:'Andorra',chinese:'安道尔共和国'},{english:'Anguilla',chinese:'安圭拉岛'},{english:'Barbuda Antigua',chinese:'安提瓜和巴布达'},{english:'Argentina',chinese:'阿根廷'},{english:'Armenia',chinese:'亚美尼亚'},{english:'Australia',chinese:'澳大利亚'},{english:'Austria',chinese:'奥地利'},{english:'Azerbaijan',chinese:'阿塞拜疆'}]
            },
            {
                name: "B",
                abroads: [{english:'Bahamas',chinese:'巴哈马'},{english:'Bahrain',chinese:'巴林'},{english:'Bangladesh',chinese:'孟加拉国'},{english:'Barbados',chinese:'巴巴多斯'},{english:'Belarus',chinese:'白俄罗斯'},{english:'Belgium',chinese:'比利时'},{english:'Belize',chinese:'伯利兹'},{english:'Benin',chinese:'贝宁'},{english:'Bermuda Is.',chinese:'百慕大群岛'},{english:'Bolivia',chinese:'玻利维亚'},{english:'Botswana',chinese:'博茨瓦纳'},{english:'Brazil',chinese:'巴西'},{english:'Brunei',chinese:'文莱'},{english:'Bulgaria',chinese:'保加利亚'},{english:'Burkina-faso',chinese:'布基纳法索'},{english:'Burma',chinese:'缅甸'},{english:'Burundi',chinese:'布隆迪'}]
            },
            {
                name: "C",
                abroads: [{english:'Cameroon',chinese:'喀麦隆'},{english:'Canada',chinese:'加拿大'},{english:'Central African Republic',chinese:'中非共和国'},{english:'Chad',chinese:'乍得'},{english:'Chile',chinese:'智利'},{english:'CN',chinese:'中国'},{english:'CO',chinese:'哥伦比亚'},{english:'CG',chinese:'刚果'},{english:'CK',chinese:'库克群岛'},{english:'CR',chinese:'哥斯达黎加'},{english:'CU',chinese:'古巴'},{english:'CY',chinese:'塞浦路斯'},{english:'CZ',chinese:'捷克'}]
            },
            {
                name: "D",
                abroads: [{english:'Denmark',chinese:'丹麦'},{english:'Djibouti',chinese:'吉布提'},{english:'Dominica Rep.',chinese:'多米尼加共和国'}]
            },
            {
                name: "E",
                abroads: [{english:'Ecuador',chinese:'厄瓜多尔'},{english:'Egypt',chinese:'埃及'},{english:'EI Salvador',chinese:'萨尔瓦多'},{english:'England',chinese:'英国'},{english:'Estonia',chinese:'爱沙尼亚'},{english:'Ethiopia',chinese:'埃塞俄比亚'}]
            },
            {
                name: "F",
                abroads: [{english:'Fiji',chinese:'斐济'},{english:'Finland',chinese:'芬兰'},{english:'France',chinese:'法国'}]
            },
            {
                name: "G",
                abroads: [{english:'French Guiana',chinese:'法属圭亚那'},{english:'Gabon',chinese:'加蓬'},{english:'Gambia',chinese:'冈比亚'},{english:'Georgia',chinese:'格鲁吉亚'},{english:'Germany',chinese:'德国'},{english:'Ghana',chinese:'加纳'},{english:'Gibraltar',chinese:'直布罗陀'},{english:'Greece',chinese:'希腊'},{english:'Grenada',chinese:'格林纳达'},{english:'Guam',chinese:'关岛'},{english:'Guatemala',chinese:'危地马拉'},{english:'Guinea',chinese:'几内亚'},{english:'Guyana',chinese:'圭亚那'}]
            },
            {
                name: "H",
                abroads: [{english:'Haiti',chinese:'海地'},{english:'Honduras',chinese:'洪都拉斯'},{english:'Hongkong',chinese:'香港'},{english:'Hungary',chinese:'匈牙利'}]
            },
            {
                name: "I",
                abroads: [{english:'Iceland',chinese:'冰岛'},{english:'India',chinese:'印度'},{english:'Indonesia',chinese:'印度尼西亚'},{english:'Iran',chinese:'伊朗'},{english:'Iraq',chinese:'伊拉克'},{english:'Ireland',chinese:'爱尔兰'},{english:'Israel',chinese:'以色列'},{english:'Italy',chinese:'意大利'}]
            },
            {
                name: "J",
                abroads: [{english:'Jamaica',chinese:'牙买加'},{english:'Japan',chinese:'日本'},{english:'Jordan',chinese:'约旦'}]
            },
            {
                name: "K",
                abroads: [{english:'Kampuchea',chinese:'柬埔寨'},{english:'Kazakstan',chinese:'哈萨克斯坦'},{english:'Kenya',chinese:'肯尼亚'},{english:'Korea',chinese:'韩国'},{english:'Kuwait',chinese:'科威特'},{english:'Kyrgyzstan',chinese:'吉尔吉斯坦'}]
            },
            {
                name: "L",
                abroads: [{english:'Laos',chinese:'老挝'},{english:'Latvia',chinese:'拉脱维亚'},{english:'Lebanon',chinese:'黎巴嫩'},{english:'Lesotho',chinese:'莱索托'},{english:'Liberia',chinese:'利比里亚'},{english:'Libya',chinese:'利比亚'},{english:'Liechtenstein',chinese:'列支敦士登'},{english:'Lithuania',chinese:'立陶宛'},{english:'Luxembourg',chinese:'卢森堡'}]
            },
            {
                name: "M",
                abroads: [{english:'Macao',chinese:'澳门'},{english:'Madagascar',chinese:'马达加斯加'},{english:'Malawi',chinese:'马拉维'},{english:'Malaysia',chinese:'马来西亚'},{english:'Maldives',chinese:'马尔代夫'},{english:'Mali',chinese:'马里'},{english:'Malta',chinese:'马耳他'},{english:'Mauritius',chinese:'毛里求斯'},{english:'Mexico',chinese:'墨西哥'},{english:'Moldova',chinese:'摩尔多瓦'},{english:'Monaco',chinese:'摩纳哥'},{english:'Mongolia',chinese:'蒙古'},{english:'Montserrat Is.',chinese:'蒙特塞拉特岛'},{english:'Morocco',chinese:'摩洛哥'},{english:'Mozambique',chinese:'莫桑比克'}]
            },
            {
                name: "N",
                abroads: [{english:'Namibia',chinese:'纳米比亚'},{english:'Nauru',chinese:'瑙鲁'},{english:'Nepal',chinese:'尼泊尔'},{english:'Netherlands',chinese:'荷兰'},{english:'New Zealand',chinese:'新西兰'},{english:'Nicaragua',chinese:'尼加拉瓜'},{english:'Niger',chinese:'尼日尔'},{english:'Nigeria',chinese:'尼日利亚'},{english:'North Korea',chinese:'朝鲜'},{english:'Norway',chinese:'挪威'}]
            },
            {
                name: "O",
                abroads: [{english:'Oman',chinese:'阿曼'}]
            },
            {
                name: "P",
                abroads: [{english:'Pakistan',chinese:'巴基斯坦'},{english:'Panama',chinese:'巴拿马'},{english:'Papua New Cuinea',chinese:'巴布亚新几内亚'},{english:'Paraguay',chinese:'巴拉圭'},{english:'Peru',chinese:'秘鲁'},{english:'Philippines',chinese:'菲律宾'},{english:'Poland',chinese:'波兰'},{english:'French Polynesia',chinese:'法属玻利尼西亚'},{english:'Portugal',chinese:'葡萄牙'},{english:'Puerto Rico',chinese:'波多黎各'}]
            },
            {
                name: "Q",
                abroads: [{english:'Qatar',chinese:'卡塔尔'}]
            },
            {
                name: "R",
                abroads: [{english:'Romania',chinese:'罗马尼亚'},{english:'Russia',chinese:'俄罗斯'}]
            },
            {
                name: "S",
                abroads: [{english:'Saint Lueia',chinese:'圣卢西亚'},{english:'Saint Vincent',chinese:'圣文森特岛'},{english:'San Marino',chinese:'圣马力诺'},{english:'Sao Tome and Principe',chinese:'圣多美和普林西比'},{english:'Saudi Arabia',chinese:'沙特阿拉伯'},{english:'Senegal',chinese:'塞内加尔'},{english:'Seychelles',chinese:'塞舌尔'},{english:'Sierra Leone',chinese:'塞拉利昂'},{english:'Singapore',chinese:'新加坡'},{english:'Slovakia',chinese:'斯洛伐克'},{english:'Slovenia',chinese:'斯洛文尼亚'},{english:'Solomon Is.',chinese:'所罗门群岛'},{english:'Somali',chinese:'索马里'},{english:'South Africa',chinese:'南非'},{english:'Spain',chinese:'西班牙'},{english:'Sri Lanka',chinese:'斯里兰卡'},{english:'Sudan',chinese:'苏丹'},{english:'Suriname',chinese:'苏里南'},{english:'Swaziland',chinese:'斯威士兰'},{english:'Sweden',chinese:'瑞典'},{english:'Switzerland',chinese:'瑞士'},{english:'Syria',chinese:'叙利亚'}]
            },
            {
                name: "T",
                abroads: [{english:'Taiwan',chinese:'台湾省'},{english:'Tajikstan',chinese:'塔吉克斯坦'},{english:'Tanzania',chinese:'坦桑尼亚'},{english:'Thailand',chinese:'泰国'},{english:'Togo',chinese:'多哥'},{english:'Tonga',chinese:'汤加'},{english:'Trinidad and Tobago',chinese:'特立尼达和多巴哥'},{english:'Tunisia',chinese:'突尼斯'},{english:'Turkey',chinese:'土耳其'},{english:'Turkmenistan',chinese:'土库曼斯坦'}]
            },
            {
                name: "U",
                abroads: [{english:'Uganda',chinese:'乌干达'},{english:'Ukraine',chinese:'乌克兰'},{english:'United Arab Emirates',chinese:'阿拉伯联合酋长国'},{english:'Uruguay',chinese:'乌拉圭'},{english:'Uzbekistan',chinese:'乌兹别克斯坦'}]
            },
            {
                name: "V",
                abroads: [{english:'Venezuela',chinese:'委内瑞拉'},{english:'Vietnam',chinese:'越南'}]
            },
            {
                name: "Y",
                abroads: [{english:'Yemen',chinese:'也门'},{english:'Yugoslavia',chinese:'南斯拉夫'}]
            },
            {
                name: "Z",
                abroads: [{english:'Zimbabwe',chinese:'津巴布韦'},{english:'Zaire',chinese:'扎伊尔'},{english:'Zambia',chinese:'赞比亚'}]
            }
        ];

        function init() {
            vm.token = IMAGE_UPLOAD.token;
            vm.link = IMAGE_UPLOAD.link;
        }
        vm.key = {
            value: null
        };
    }
})();

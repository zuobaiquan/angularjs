angular.module('myApp',[])
    //自定义过滤器 用于省市区下拉框的联动
    .filter('cityFilter',function(){
        return function (data,parent){
            var filterData=[];
            angular.forEach(data,function(obj){
                if(obj.parent === parent){
                    filterData.push(obj);
                }
            });
            return filterData;
        }
    })

    //自定义表单错误验证 指令even
    .directive('even',function(){
        return {
            require:'ngModel',
            link:function(scope,ele,attrs,ngModelController){

                //$parsers view到model要执行的函数数组
                ngModelController.$parsers.push(function(viewValue){
                    if(viewValue %2 == 0){
                        ngModelController.$setValidity('even',true);
                    }else{
                        ngModelController.$setValidity('even',false);
                    }
                    console.log('view到model');
                    return viewValue;
                });

                //$formatters model到view要执行的函数数组
                ngModelController.$formatters.push(function(modelValue){
                    console.log('model到view');
                    return modelValue * 100 ;
                });
            }
        }
    })

    //自定义表单控件 指令custom-text-area
    .directive('customTextArea',function(){
        return{
            restrict:'E',
            template:'<div style="border:1px solid #bbb;line-height:38px;" contenteditable="true" ></div>',
            replace:true,
            require:'ngModel',
            link:function(scope,ele,attrs,ngModelController){
                ele.on('keyup',function(){
                    scope.$apply(function(){
                        ngModelController.$setViewValue(ele.html()); // view->model
                    });
                });

                ngModelController.$render=function(){
                    ele.html(ngModelController.$viewValue);         // model->view
                }

            }
        }
    })

    .controller('myCtrl',['$scope',function($scope){
        var that =this; //当前环境上下文

        //字典数据
        $scope.cities=[
            {name:'上海',parent:0,id:1},
            {name:'上海市',parent:1,id:2},
            {name:'徐汇区',parent:2,id:3},

            {name:'北京',parent:0,id:4},
            {name:'北京市',parent:4,id:5},
            {name:'东城区',parent:5,id:6},
            {name:'西城区',parent:5,id:7},
            {name:'昌平区',parent:5,id:8},

            {name:'浙江',parent:0,id:9},
            {name:'宁波',parent:9,id:10},
            {name:'杭州',parent:9,id:11},
            {name:'宁波一区',parent:10,id:12},
            {name:'宁波二区',parent:10,id:13}
        ];
        this.findParentId=function(id){
            var parentId=0;
            angular.forEach($scope.cities,function(city){
                if(city.id == id){
                    parentId=city.parent;
                    return;
                }
            });
            return parentId;
        };

        $scope.hobbies=[
            {id:1, name:'玩游戏'},
            {id:2, name:'写代码'},
            {id:3, name:'唱歌'}
        ];

        //表单中默认的用户数据
        $scope.data={
            hobbies:[2],
            area:8
        };
        //先保留一份默认值
        $scope.origData=angular.copy($scope.data);

        //重置事件
        $scope.reset=function(){
            $scope.data=angular.copy($scope.origData);
            $scope.myForm.$setPristine();//表单恢复原值
            that.initCity();
        };


        //显示省市区
        this.initCity=function(){
            $scope.data.city=this.findParentId($scope.data.area);
            $scope.data.province=this.findParentId($scope.data.city);
        };
        //网页刚刚打开执行
        this.initCity.call(this);

        //选择/取消爱好多选框 改变对应的model
        $scope.toggleHobbySelection=function(hobbyId){
            var index=-1;
            if($scope.data.hobbies === undefined){
                $scope.data.hobbies=[];
            }else {
                index=$scope.data.hobbies.indexOf(hobbyId);
            }

            if(index === -1){
                $scope.data.hobbies.push(hobbyId);
            }else{
                $scope.data.hobbies.splice(index,1);
            }
            console.log($scope.data.hobbies);
        };

    }]);
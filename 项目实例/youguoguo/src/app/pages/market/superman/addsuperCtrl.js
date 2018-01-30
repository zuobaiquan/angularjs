
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.market')
    .controller('addsuperCtrl', addsuperCtrl);

  function addsuperCtrl($scope, $state,apiRequest,$timeout,$uibModalInstance,adminService,modalsService,toastr,modal,QINIU_LINK,IMAGE_UPLOAD) {
      var vm = this;
      vm.key = {
          value: null
      };
      vm.init = init;
      $scope.disables = false;
      $scope.modal = modal;
      $scope.isStoredetail=false;

      $scope.changeStyle=function(id,typename,isclick){
          if(isclick==false){
              angular.element("body").find("#"+id).css({"borderColor":"#ddd"});
              $scope.modal.params.rangeServiceList = $scope.modal.params.rangeServiceList.filter(function (item) {
                  return item.id!=id;
              })
          }
          else{
              $scope.modal.params.rangeServiceList.push({
                  id:id,
                  typeName:typename
              });
              angular.element("body").find("#"+id).css({"borderColor":"#0066FF"});
          }
      }
      $scope.checkInput=function(){
          if($scope.isRightphone==false){
              toastr.error("手机号非会员，无法添加", '');
              return false;
          }
          if(modal.params.approvePhoto==""){
              toastr.error("身份证照片不能为空", '');
              return false;
          }
          if(modal.params.licensePhoto==""){
              toastr.error("营业执照不能为空", '');
              return false;
          }
          else{
              return true;
          }
      }

      $scope.update=function(){
          modal.params.adminId=adminService.getAdmin().admin.id;
          console.log(modal.params);
          if($scope.checkInput()) {
              // if (modal.params.rangeServiceList.length == 0) {
              //     toastr.error("服务领域至少选一项", '');
              //     return false;
              // }
              $scope.disables = true;
              apiRequest.postJson("/admin/expertPerson/updateExpertPerson",modal.params,function(res){
                  modal.success=modal.success||"修改成功";
                  toastr.success(modal.success);
                  $uibModalInstance.close("success");
                  $state.reload();
              },function(err){
                  toastr.error(err.message, '');
                  $scope.disables = false;
              });
          }
          else{
              console.log("内容输入错误");
          }

      }
      $scope.isRightphone=true;
      $scope.showNickname=false;
      $scope.$watch("modal.params.phone",function(newValue,oldValue){
         var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
         if(reg.test(newValue)){
            apiRequest.post('/admin/shop/getNickName', {phone:newValue}, function(res) {
                $scope.showNickname=true;
                $scope.isRightphone=true;
                $scope.nickname=res.data;
            },function(err){
                $scope.showNickname=true;
                $scope.isRightphone=false;
                $scope.nickname=err.message;
            });
         }
      });

      $scope.getAllRangeService=function(){
          $scope.items=[{isclick:false},{isclick:false},{isclick:false},{isclick:false},{isclick:false},{isclick:false}];
          apiRequest.post('/admin/shop/loadAllRangeService', {}, function(res) {
              $scope.rangeServicelist=res.data;
              $timeout(function(){
                  for(var i=0;i<res.data.length;i++){
                      for(var item in modal.params.rangeServiceList){
                          var tid=modal.params.rangeServiceList[item].id;
                          if(tid==res.data[i].id){
                              angular.element("body").find("#"+tid).css({"borderColor":"#0066FF"});
                              $scope.items[tid-1].isclick=true;
                          }
                      }
                  }
              },50);
          });
      }

      $scope.sampleImg=function(id){
          if(typeof angular.element("body").find(".sampleImg"+id).attr("style")=="undefined"){
              angular.element("body").find(".sampleImg"+id).css({"display":"none"});
              angular.element("body").find("#showsample"+id).html("查看样例照片");
          }
          else{
              angular.element("body").find(".sampleImg"+id).removeAttr("style");
              angular.element("body").find("#showsample"+id).html("关闭样例照片");
          }
      }
      $scope.hideImg=function(id){
          angular.element("body").find(".sampleImg"+id).css({"display":"none"});
          angular.element("body").find("#showsample"+id).html("查看样例照片");
      }

      $scope.refuse=function(id){
          $uibModalInstance.close("success");
          $scope.modal = {
              url: "/admin/expertPerson/rejectExpertPerson",
              title: "驳回理由",
              success: "驳回理由已填写",
              params: {
                  id: id,
                  reason:''
              }
          };
          modalsService.normal('app/pages/market/store/addreason.html','ModalCtrl',$scope.modal,function(){});
      }

      $scope.delstore=function(id){
          $scope.modal = {
              url: "/admin/expertPerson/deleteExperPerson",
              title: "确认信息",
              success: "该达人删除成功",
              message: "您确定要删除该达人吗？",
              params: {
                  id: id,
              }
          };
          modalsService.callback($scope.modal,function(){
              $uibModalInstance.close();
              $state.reload();
          });
      }

      $scope.pass=function(id){
          apiRequest.post('/admin/expertPerson/passExpertPerson', { id:id }, function (res) {
              if (res.code == "200") {
                  toastr.success('审核提交成功');
                  $uibModalInstance.close();
              } else {
                  toastr.error(res.message, '');
                  $scope.$apply();
              }
          });
      }

      $scope.edit=function(item){
          $uibModalInstance.close("success");
          $scope.modal = {
              params: item.params,
              title: "修改达人信息"
          };
          modalsService.normal('app/pages/market/superman/editsuper.html','addsuperCtrl',$scope.modal,function(){});
      }

      function init() {
          vm.token = IMAGE_UPLOAD.token;
          vm.link = QINIU_LINK;
      }

  }

})();

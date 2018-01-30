(function () {
  'use strict';

angular.module('BlurAdmin.theme')
 .directive("textareaInput", function() {
    return {
    	restrict: 'AE',
    	template: function(elem, attr) {
         var placeholder=attr.placeholder||"点击输入内容";
    		var len=attr.len||250;
         var col=attr.col|| "col-sm-6";
            var required=attr.required || false;
    		var res = '';
    		res+='<div class="'+col+'" style="position:relative;display:inline-block;">';
    		res+='<textarea style="height:150px;" class="form-control" ng-required='+required+' name='+attr.name+' maxlength='+len+' placeholder='+placeholder+' ng-model="textInput">';
    		res+='</textarea>';
            res+='<span id="texttips" style="position:absolute;bottom:10px;right:30px;">{{(textInput==null||textInput=="")?0:textInput.length}}';
            res+='/'+len;
            res+='</span>';
    		res+='</div';
			return res;
    	},
        scope: {
            textInput: "="
        }
    }
})
})();

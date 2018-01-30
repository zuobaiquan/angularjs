/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('timeFormat', timeFormat);

  /** @ngInject */
  function timeFormat() {
    return function(text,num) {
        if(text==null){
            return "--";
        }
        var str="";
        var arr=[];
        for(var i in text){
        	arr[i]=text[i]<10?('0'+text[i]):text[i];
        	if((i==0)||(i==1)){
        		str+=arr[i]+"-";
        	}
            if(i==2){
                str+=arr[i]+" ";
            }
            if(i==3){
                str+=arr[i]+":";
            }
            if(i==4){
                str+=arr[i]+"";
            }
        }
        return str;
    };
  }

})();

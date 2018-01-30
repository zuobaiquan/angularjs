/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('sexInfo', sexInfo);

  /** @ngInject */
  function sexInfo() {
    return function(text) {
		text=parseInt(text);
        if(text==1){
			return '女'
		}
		if(text==2){
			return '男'
		}
		else{
			return '未知';
		}
        
    };
  }

})();

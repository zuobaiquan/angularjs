/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('removeWord', removeWord);

  /** @ngInject */
  function removeWord() {
    return function(text,num) {
        if(text==null){
            return "";
        }
        if(text.length>num){
            return text.substring(0,num)+"...";
        }
        else{
            return text;
        }
    };
  }

})();

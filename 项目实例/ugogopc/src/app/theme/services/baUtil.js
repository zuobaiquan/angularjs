
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .service('baUtil', baUtil);

  function baUtil() {

    this.isDescendant = function(parent, child) {
      var node = child.parentNode;
      while (node != null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    };

    this.hexToRGB = function(hex, alpha) {
      var r = parseInt( hex.slice(1,3), 16 );
      var g = parseInt( hex.slice(3,5), 16 );
      var b = parseInt( hex.slice(5,7), 16 );
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    };
    this.textInputcount=function(text,num){
        text=text+"";
        if(text.length<num&&text.length!=0){
            return true;
        }
        else{
            return false;
        }
    };
    this.isNextDay=function(start,end){
        var starttime=start.split(":");
        var endtime=end.split(":");
        if(endtime[0]-starttime[0]<0){
            return "(次日)";
        }
        if(endtime[0]-starttime[0]==0){
            if(endtime[1]-starttime[1]<0){
                return "(次日)";
            }else{return "";}
        }
        else{return ""; }
    };


  }
})();

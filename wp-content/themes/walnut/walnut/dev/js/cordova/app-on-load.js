define(['underscore', 'jquery', 'fastclick'], function(_, $, FastClick) {
  return document.addEventListener("deviceready", (function(_this) {
    return function() {
      _.cordovaOpenPrepopulatedDatabase();
      return $(function() {
        return FastClick.attach(document.body);
      });
    };
  })(this), false);
});

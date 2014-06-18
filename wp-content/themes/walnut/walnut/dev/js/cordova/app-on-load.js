define(['underscore', 'jquery', 'fastclick'], function(_, $, FastClick) {
  var onDeviceReady;
  onDeviceReady = function() {
    _.cordovaOpenPrepopulatedDatabase();
    return FastClick.attach(document.body);
  };
  return document.addEventListener("deviceready", onDeviceReady, false);
});

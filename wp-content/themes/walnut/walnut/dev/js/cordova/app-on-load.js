define(['underscore', 'jquery', 'fastclick'], function(_, $, FastClick) {
  var onDeviceReady;
  onDeviceReady = function() {
    _.cordovaOpenPrepopulatedDatabase();
    _.cordovaLocalStorage();
    FastClick.attach(document.body);
    return cordova.getAppVersion().then(function(version) {
      return AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";;
    });
  };
  return document.addEventListener("deviceready", onDeviceReady, false);
});

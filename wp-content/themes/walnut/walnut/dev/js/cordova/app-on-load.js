define(['underscore', 'jquery', 'fastclick'], function(_, $, FastClick) {
  var onDeviceReady;
  onDeviceReady = function() {
    _.cordovaOpenPrepopulatedDatabase();
    FastClick.attach(document.body);
    return cordova.getAppVersion().then(function(version) {
      if (version.indexOf('Production') === 0) {
        AJAXURL = "http://synapselearning.net/wp-admin/admin-ajax.php";;
      }
      if (version.indexOf('Staging') === 0) {
        return AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";;
      }
    });
  };
  return document.addEventListener("deviceready", onDeviceReady, false);
});

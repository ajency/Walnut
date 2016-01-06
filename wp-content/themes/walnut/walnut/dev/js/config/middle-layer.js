define(['detect', 'jquery'], function(detect, $) {
  var checkConnection, checkPlatform, networkStatus;
  networkStatus = 0;
  checkPlatform = function() {
    var ua;
    ua = detect.parse(navigator.userAgent);
    if (ua.os.family === "Android" || ua.os.family === "iOS") {
      return "Mobile";
    } else {
      return "Desktop";
    }
  };
  if (checkPlatform() === "Desktop") {
    $.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js');
  }
  window.onLineHandler = function(){
        networkStatus = 1
        };
  window.offLineHandler = function(){
        networkStatus = 0
        };
  window.isOnline = function() {
    if (networkStatus === 1) {
      return true;
    } else {
      return true;
    }
  };
  checkConnection = function() {
    if (_.isUndefined(navigator.connection)) {
      return true;
    } else {
      return true;
    }
  };
  document.addEventListener("online", onOnline, false);
  function onOnline(){
      };
  document.addEventListener("offline", onOffline, false);
  function onOffline(){
      };
  return $.middle_layer = function(url, data, response) {
    switch (checkPlatform()) {
      case 'Desktop':
        if (isOnline()) {
          return $.post(url, data, response, 'json');
        } else {
          return 'connection_error';
        }
        break;
      case 'Mobile':
        if (checkConnection()) {
          return $.post(url, data, response, 'json');
        } else {
          return 'connection_error';
        }
    }
  };
});

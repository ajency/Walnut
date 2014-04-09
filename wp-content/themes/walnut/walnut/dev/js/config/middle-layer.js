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
  window.onLineHandler = function() {
    return networkStatus = 1;
  };
  window.offLineHandler = function() {
    return networkStatus = 0;
  };
  window.isOnline = function() {
    if (networkStatus === 1) {
      return true;
    } else {
      return false;
    }
  };
  checkConnection = function() {
    if (navigator.connection.type === Connection.NONE) {
      return false;
    } else {
      return true;
    }
  };
  document.addEventListener("online", function() {
    return console.log('Online');
  }, false);
  document.addEventListener("offline", function() {
    return console.log('Offline');
  }, false);
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

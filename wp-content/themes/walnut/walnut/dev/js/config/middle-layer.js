define(['plugins/detect', 'jquery', 'plugins/online'], function(detect, $) {
  var checkConnection, checkPlatform, networkStatus, onOffline, onOnline;
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
  if (window.navigator.onLine) {
    networkStatus = 1;
  } else {
    networkStatus = 0;
  }
  window.onLineHandler = function() {
    if (checkPlatform() === "Desktop") {
      networkStatus = 1;
    }
  };
  window.offLineHandler = function() {
    if (checkPlatform() === "Desktop") {
      networkStatus = 0;
    }
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
  document.addEventListener("online", onOnline, false);
  onOnline = function() {
    alert("On");
  };
  document.addEventListener("offline", onOffline, false);
  onOffline = function() {
    alert("Off");
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

define(['detect', 'jquery', 'underscore'], function(detect, $, _) {
  var networkStatus;
  networkStatus = 0;
  _.checkPlatform = function() {
    var ua;
    ua = detect.parse(navigator.userAgent);
    if (ua.os.family === "Android" || ua.os.family === "iOS") {
      return "Mobile";
    } else {
      return "Desktop";
    }
  };
  if (_.checkPlatform() === "Desktop") {
    $.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js');
  }
  window.onLineHandler = function() {
    return networkStatus = 1;
  };
  window.offLineHandler = function() {
    return networkStatus = 0;
  };
  document.addEventListener("online", function() {
    return console.log('Online');
  }, false);
  document.addEventListener("offline", function() {
    return console.log('Offline');
  }, false);
  return _.isOnline = function() {
    switch (_.checkPlatform()) {
      case 'Desktop':
        if (networkStatus === 1) {
          return true;
        } else {
          return false;
        }
        break;
      case 'Mobile':
        if (navigator.connection.type === Connection.NONE) {
          return false;
        } else {
          return true;
        }
    }
  };
});

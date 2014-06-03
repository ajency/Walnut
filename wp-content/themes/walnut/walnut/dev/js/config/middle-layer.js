define(['detect', 'jquery', 'underscore'], function(detect, $, _) {
  var connected;
  _.platform = function() {
    var ua;
    ua = detect.parse(navigator.userAgent);
    if (ua.os.family === "Android" || ua.os.family === "iOS") {
      return "DEVICE";
    } else {
      return "BROWSER";
    }
  };
  if (_.platform() === 'BROWSER') {
    $.getScript('wp-content/themes/walnut/walnut/dev/js/plugins/online.js');
  }
  connected = false;
  window.onLineHandler = function() {
    return connected = true;
  };
  window.offLineHandler = function() {
    return connected = false;
  };
  document.addEventListener("online", function() {
    console.log('Online');
    $('#connectionStatus').text('Available');
    return $('#online').prop("disabled", false);
  }, false);
  document.addEventListener("offline", function() {
    console.log('Offline');
    $('#connectionStatus').text('Unavailable');
    $('#online').prop("disabled", true);
    $('#online').prop("checked", false);
    return $("#offline").prop("checked", true);
  }, false);
  _.isOnline = function() {
    switch (_.platform()) {
      case 'BROWSER':
        return connected;
      case 'DEVICE':
        if (_.isUndefined(navigator.connection)) {
          return connected;
        } else {
          if (navigator.connection.type === Connection.NONE) {
            return false;
          } else {
            return true;
          }
        }
    }
  };
  return _.setMainLogo = function() {
    switch (_.platform()) {
      case 'DEVICE':
        if (_.getSchoolLogoSrc() !== null) {
          return $("#logo").attr('src', _.getSchoolLogoSrc());
        } else {
          return $("#logo").attr('src', '/images/logo-synapse.png');
        }
    }
  };
});

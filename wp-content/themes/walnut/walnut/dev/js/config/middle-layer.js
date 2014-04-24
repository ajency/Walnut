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
  if (_.checkPlatform() === 'Desktop') {
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
  _.isOnline = function() {
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
  return _.getUserRole = function(username) {
    var onFailure, onSuccess, role, runQuery;
    role = '';
    runQuery = function() {
      return $.Deferred(function(d) {
        return _.userDb.transaction(function(tx) {
          return tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), onFailure(d));
        });
      });
    };
    onSuccess = function(d) {
      return function(tx, data) {
        var i, r;
        i = 0;
        while (i < data.rows.length) {
          r = data.rows.item(i);
          if (r['username'] === username) {
            role = r['user_role'];
          }
          i++;
        }
        return d.resolve(role);
      };
    };
    onFailure = function(d) {
      return function(tx, error) {
        return d.reject('OnFailure!: ' + error);
      };
    };
    return $.when(runQuery()).done(function() {
      return console.log('getUserRole transaction completed');
    }).fail(function(err) {
      return console.log('Error: ' + err);
    });
  };
});

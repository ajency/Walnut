define(['underscore'], function(_) {
  return _.mixin({
    getStudentsByDivision: function(division) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _i, _ref;
          result = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            result[i] = {
              ID: row['ID'],
              display_name: row['display_name'],
              user_email: row['user_email'],
              profile_pic: '/images/avtar.png'
            };
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('getStudentsByDivision transaction completed');
      }).fail(_.failureHandler);
    },
    getNamesOfAllOfflineUsers: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT username FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, _i, _ref;
          result = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            result[i] = {
              username: data.rows.item(i)['username']
            };
            console.log(result[i]);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getNamesOfAllOfflineUsers transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

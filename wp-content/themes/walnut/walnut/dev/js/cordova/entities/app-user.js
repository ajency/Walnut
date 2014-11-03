define(['underscore'], function(_) {
  return _.mixin({
    getStudentsByDivision: function(division) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, length, result;
        result = [];
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            result[i] = {
              ID: row['ID'],
              display_name: row['display_name'],
              user_email: row['user_email'],
              profile_pic: '/images/avtar.png'
            };
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(result);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getNamesOfAllOfflineUsers: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, length, result;
        result = [];
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            result[i] = {
              username: row['username']
            };
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(result);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT username FROM USERS", [], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});

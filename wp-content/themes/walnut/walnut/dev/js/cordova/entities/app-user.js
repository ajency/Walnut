define(['underscore'], function(_) {
  return _.mixin({
    getStudentsByDivision: function(division) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          defer.resolve(result);
        } else {
          forEach = function(row, i) {
            result[i] = {
              ID: row['ID'],
              display_name: row['display_name'],
              user_email: row['user_email'],
              profile_pic: '/images/avtar.png'
            };
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(result);
            }
          };
        }
        return forEach(data.rows.item(0), 0);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getUserByID: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result, row;
        row = data.rows.item(0);
        result = {
          ID: row['user_id'],
          display_name: row['display_name'],
          user_email: row['user_email'],
          user_role: row['user_role'],
          profile_pic: '/images/avtar.png'
        };
        return defer.resolve(result);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM USERS WHERE user_id = ?", [_.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getNamesOfAllOfflineUsers: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            result[i] = {
              username: data.rows.item(i)['username']
            };
            console.log(JSON.stringify(result[i]));
            i = i + 1;
            if (i < data.rows.length) {
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

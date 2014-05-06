define(['underscore', 'underscorestring'], function(_) {
  _.mixin(_.str.exports());
  return _.mixin({
    deferredErrorHandler: function(d) {
      return function(tx, error) {
        return d.reject(error);
      };
    },
    failureHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    transactionErrorHandler: function(tx, error) {
      return console.log('ERROR: ' + error.message);
    },
    getUserRole: function(username) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.userDb.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, r, role;
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
      return $.when(runQuery()).done(function() {
        return console.log('getUserRole transaction completed');
      }).fail(_.failureHandler);
    },
    getQuestionType: function(content_piece_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_postmeta WHERE post_id=? AND meta_key='question_type'", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var meta_value;
          meta_value = data.rows.item(0)['meta_value'];
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuestionType transaction completed');
      }).fail(_.failureHandler);
    },
    getLastDetails: function(collection_id, division) {
      var lastDetails, onSuccess, runQuery;
      lastDetails = {
        id: '',
        date: '',
        status: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT id, status, date FROM wp_training_logs WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          if (data.rows.length !== 0) {
            lastDetails.id = data.rows.item(0)['id'];
            lastDetails.date = data.rows.item(0)['date'];
            lastDetails.status = data.rows.item(0)['status'];
          }
          return d.resolve(lastDetails);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastDetails transaction completed');
      }).fail(_.failureHandler);
    },
    getCurrentDate: function() {
      var d, date;
      d = new Date();
      date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      return date;
    }
  });
});

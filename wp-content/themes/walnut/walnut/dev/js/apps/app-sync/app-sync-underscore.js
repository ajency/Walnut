define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getTotalSyncDetailsCount: function(operation) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(*) AS count FROM sync_details WHERE type_of_operation=?", [operation], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var count;
          count = data.rows.item(0)['count'];
          return d.resolve(count);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTotalSyncDetailsCount transaction completed');
      }).fail(_.failureHandler);
    },
    getLastSyncTimeStamp: function(operation) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT time_stamp FROM sync_details WHERE type_of_operation=? ORDER BY id DESC LIMIT 1", [operation], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var time_stamp;
          time_stamp = '';
          if (data.rows.length !== 0) {
            time_stamp = data.rows.item(0)['time_stamp'];
          }
          return d.resolve(time_stamp);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastSyncTimeStamp transaction completed');
      }).fail(_.failureHandler);
    },
    getTotalRecordsTobeSynced: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT SUM(rows) AS total FROM (SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "training_logs WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "question_response WHERE sync=? UNION ALL SELECT COUNT(*) AS rows FROM " + _.getTblPrefix() + "question_response_logs WHERE sync=?)", [0, 0, 0], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var totalRecords;
          totalRecords = data.rows.item(0)['total'];
          return d.resolve(totalRecords);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTotalRecordsTobeSynced transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

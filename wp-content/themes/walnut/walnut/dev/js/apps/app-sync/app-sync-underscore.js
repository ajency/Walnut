define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getLastSyncOperation: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT type_of_operation FROM sync_details ORDER BY id DESC LIMIT 1", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var last_operation;
          last_operation = 'none';
          if (data.rows.length !== 0) {
            last_operation = data.rows.item(0)['type_of_operation'];
          }
          return d.resolve(last_operation);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastSyncOperation transaction completed');
      }).fail(_.failureHandler);
    },
    getTotalRecordsTobeSynced: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(*) AS total FROM " + _.getTblPrefix() + "question_response WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d));
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
    },
    getLastDownloadTimeStamp: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT time_stamp FROM sync_details WHERE type_of_operation=? ORDER BY id DESC LIMIT 1", ['file_download'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var time_stamp;
          time_stamp = 'none';
          if (data.rows.length !== 0) {
            time_stamp = data.rows.item(0)['time_stamp'];
          }
          return d.resolve(time_stamp);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastDownloadTimeStamp transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

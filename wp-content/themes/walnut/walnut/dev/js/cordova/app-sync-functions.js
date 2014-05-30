define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getTotalSyncDetailsCount: function() {
      var onSuccess, runQuery;
      console.log('getTotalSyncDetailsCount');
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(*) AS count FROM sync_details", [], onSuccess(d), _.deferredErrorHandler(d));
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
    }
  });
});

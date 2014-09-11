define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getQuizResponseSummaryByCollectionIdAndUserID: function(collection_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT taken_on, quiz_meta, summary_id FROM " + _.getTblPrefix() + "quiz_response_summary WHERE collection_id=? AND student_id=?", [collection_id, _.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var quiz_meta, result, row;
          result = '';
          row = data.rows.item(0);
          quiz_meta = _.unserialize(row['quiz_meta']);
          result = {
            collection_id: collection_id,
            status: quiz_meta.status,
            num_skipped: 9,
            student_id: _.getUserID(),
            summary_id: row['summary_id'],
            taken_on: row['taken_on'],
            total_marks_scored: 0.7,
            total_time_taken: 26
          };
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseSummaryByCollectionIdAndUserID transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

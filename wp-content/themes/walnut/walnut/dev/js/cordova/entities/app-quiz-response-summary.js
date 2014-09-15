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
          var countForSkippedQuestion, quiz_meta, result, row;
          result = '';
          row = data.rows.item(0);
          quiz_meta = _.unserialize(row['quiz_meta']);
          countForSkippedQuestion = _.getCountForSkippedQuestion();
          return countForSkippedQuestion.done(function(skipped) {
            var totalMarksScoredAndTotalTimeTaken;
            totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id']);
            return totalMarksScoredAndTotalTimeTaken.done(function(value) {
              result = {
                collection_id: collection_id,
                status: quiz_meta.status,
                num_skipped: skipped,
                student_id: _.getUserID(),
                summary_id: row['summary_id'],
                taken_on: row['taken_on'],
                total_marks_scored: value.total_marks_scored,
                total_time_taken: value.total_time_taken
              };
              return d.resolve(result);
            });
          });
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseSummaryByCollectionIdAndUserID transaction completed');
      }).fail(_.failureHandler);
    },
    getCountForSkippedQuestion: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT count(status) AS num_skipped FROM " + _.getTblPrefix() + "quiz_question_response WHERE status=?", ["skipped"], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result;
          result = data.rows.item(0)['num_skipped'];
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getCountForSkippedQuestion transaction completed');
      }).fail(_.failureHandler);
    },
    getQuizResponseByCollectionIdAndUserID: function(collection_id) {
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
          var countForSkippedQuestion, quiz_meta, result, row;
          result = '';
          row = data.rows.item(0);
          quiz_meta = _.unserialize(row['quiz_meta']);
          countForSkippedQuestion = _.getCountForSkippedQuestion();
          return countForSkippedQuestion.done(function(skipped) {
            var totalMarksScoredAndTotalTimeTaken;
            totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id']);
            return totalMarksScoredAndTotalTimeTaken.done(function(value) {
              result = {
                collection_id: collection_id,
                status: quiz_meta.status,
                num_skipped: skipped,
                student_id: _.getUserID(),
                summary_id: row['summary_id'],
                taken_on: row['taken_on'],
                total_marks_scored: value.total_marks_scored,
                total_time_taken: value.total_time_taken
              };
              return d.resolve(result);
            });
          });
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseByCollectionIdAndUserID transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

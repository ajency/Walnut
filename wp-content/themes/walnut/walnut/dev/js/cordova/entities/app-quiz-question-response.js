define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getQuizQuestionResponseBySummaryID: function(summary_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE summary_id = ?", [summary_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var totalMarksScoredAndTotalTimeTaken;
            totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(summary_id);
            return totalMarksScoredAndTotalTimeTaken.done(function(value) {
              return result[i] = {
                content_piece_id: row['content_piece_id'],
                marks_scored: value.total_marks_scored,
                qr_id: row['qr_id'],
                question_response: _.unserialize(row['question_response']),
                status: row['status'],
                summary_id: summary_id,
                time_taken: value.total_time_taken
              };
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizQuestionResponseBySummaryID transaction completed');
      }).fail(_.failureHandler);
    },
    getTotalMarksScoredAndTotalTimeTaken: function(summary_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT SUM(marks_scored) as total_marks_scored, SUM(time_taken) as total_time_taken FROM " + _.getTblPrefix() + "quiz_question_response WHERE summary_id = ?", [summary_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result;
          result = '';
          result = data.rows.item(0);
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTotalMarksScoredAndTotalTimeTaken transaction completed');
      }).fail(_.failureHandler);
    },
    getQuizQuestionResponseBySummaryID: function(content_piece_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE content_piece_id = ?", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var totalMarksScoredAndTotalTimeTaken;
            totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(summary_id);
            return totalMarksScoredAndTotalTimeTaken.done(function(value) {
              return result[i] = {
                content_piece_id: content_piece_id,
                marks_scored: value.total_marks_scored,
                qr_id: row['qr_id'],
                question_response: _.unserialize(row['question_response']),
                status: row['status'],
                summary_id: row['summary_id'],
                time_taken: value.total_time_taken
              };
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizQuestionResponseBySummaryID transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

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
          var quizResponseSummary, quiz_meta, result, row;
          result = '';
          row = data.rows.item(0);
          quiz_meta = _.unserialize(row['quiz_meta']);
          quizResponseSummary = _.getQuizResponseSummaryByCollectionId(collection_id);
          return quizResponseSummary.done(function(quiz_responses) {
            var countForSkippedQuestion;
            countForSkippedQuestion = _.getCountForSkippedQuestion();
            return countForSkippedQuestion.done(function(skipped) {
              var totalMarksScoredAndTotalTimeTaken;
              totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id']);
              return totalMarksScoredAndTotalTimeTaken.done(function(value) {
                result = {
                  collection_id: collection_id,
                  marks_scored: value.marks_scored,
                  negative_scored: value.negative_scored,
                  num_skipped: skipped,
                  questions_order: quiz_meta.questions_order,
                  status: quiz_meta.status,
                  student_id: _.getUserID(),
                  summary_id: row['summary_id'],
                  taken_on: row['taken_on'],
                  total_marks_scored: value.total_marks_scored,
                  total_time_taken: value.total_time_taken
                };
                return d.resolve(result);
              });
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
    writeQuizResponseSummary: function(model) {
      var collectionMeta, quizMeta, quizMetaValue;
      quizMetaValue = '';
      quizMeta = '';
      collectionMeta = _.getCollectionMeta(model.get('collection_id'));
      collectionMeta.done(function(collectionMetaData) {
        if (collectionMetaData.quizType === "practice") {
          quizMetaValue = model.get('status');
          return quizMeta = {
            'status': quizMetaValue
          };
        } else {
          quizMetaValue = model.get('status');
          return quizMeta = {
            'status': quizMetaValue
          };
        }
      });
      if (model.get('summary_id') === "" || typeof model.get('summary_id') === 'undefined') {
        return _.insertIntoQuizResponseSummary(model, quizMeta);
      } else {
        return _.updateIntoQuizResponseSummary(model, quizMeta);
      }
    },
    insertIntoQuizResponseSummary: function(model, quizMetaValue) {
      var serializeQuizMetaValue, start_date, summary_id;
      summary_id = 'Q' + model.get('collection_id') + 'S' + _.getUserID();
      serializeQuizMetaValue = serialize(quizMetaValue);
      start_date = _.getCurrentDateTime(0);
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_response_summary (summary_id , collection_id, student_id, quiz_meta, taken_on, sync) VALUES (?,?,?,?,?,?)", [summary_id, model.get('collection_id'), _.getUserID(), serializeQuizMetaValue, start_date], 0);
      }, _.transactionErrorhandler, function(tx) {
        console.log('Inserted data in quiz_response_summary');
        return model.set({
          'summary_id': summary_id
        });
      });
    },
    updateIntoQuizResponseSummary: function(model, quizMeta) {
      var serializeQuizMetaValue;
      serializeQuizMetaValue = serialize(quizMeta);
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_response_summary SET quiz_meta=?, sync=? WHERE summary_id=?", [serializeQuizMetaValue, 0, model.get('summary_id')]);
      }, _.transactionErrorhandler, function(tx) {
        model.set({
          'summary_id': summary_id
        });
        return console.log('Updated data in quiz_response_summary');
      });
    }
  });
});

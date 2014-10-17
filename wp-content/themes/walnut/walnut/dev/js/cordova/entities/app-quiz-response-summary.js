define(['underscore', 'unserialize', 'serialize'], function(_) {
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
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var quizResponseSummary;
            quizResponseSummary = _.getQuizResponseSummaryByCollectionId(collection_id);
            return quizResponseSummary.done(function(quiz_responses) {
              return (function(row, i, quiz_responses) {
                var countForSkippedQuestion;
                countForSkippedQuestion = _.getCountForSkippedQuestion(row['summary_id']);
                return countForSkippedQuestion.done(function(skipped) {
                  return (function(row, i, quiz_responses, skipped) {
                    var totalMarksScoredAndTotalTimeTaken;
                    totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id']);
                    return totalMarksScoredAndTotalTimeTaken.done(function(value) {
                      var quiz_meta, userID;
                      userID = _.getUserID();
                      quiz_meta = _.unserialize(row['quiz_meta']);
                      return result[i] = {
                        collection_id: collection_id,
                        marks_scored: value.marks_scored,
                        attempts: quiz_responses.attempts,
                        negative_scored: value.negative_scored,
                        num_skipped: skipped,
                        questions_order: quiz_meta.questions_order,
                        status: quiz_meta.status,
                        student_id: userID,
                        summary_id: row['summary_id'],
                        taken_on: row['taken_on'],
                        total_marks_scored: value.total_marks_scored,
                        total_time_taken: value.total_time_taken
                      };
                    });
                  })(row, i, quiz_responses, skipped);
                });
              })(row, i, quiz_responses);
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
        return console.log('getQuizResponseSummaryByCollectionIdAndUserID transaction completed');
      }).fail(_.failureHandler);
    },
    getCountForSkippedQuestion: function(summary_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(status) AS num_skipped FROM " + _.getTblPrefix() + "quiz_question_response WHERE status = ? AND summary_id = ?", ['skipped', summary_id], onSuccess(d), _.deferredErrorHandler(d));
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
        return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_response_summary (summary_id , collection_id, student_id, quiz_meta, taken_on, sync) VALUES (?,?,?,?,?,?)", [summary_id, model.get('collection_id'), _.getUserID(), serializeQuizMetaValue, start_date, 0]);
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

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
            return tx.executeSql("SELECT SUM(marks_scored) as total_marks_scored, SUM(CASE WHEN status = 'wrong_answer' THEN marks_scored ELSE 0 END) as negative_scored, SUM(CASE WHEN status <> 'wrong_answer' THEN marks_scored ELSE 0 END) as marks_scored, SUM(time_taken) as total_time_taken FROM " + _.getTblPrefix() + "quiz_question_response WHERE summary_id = ?", [summary_id], onSuccess(d), _.deferredErrorHandler(d));
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
    writeQuestionResponse: function(model) {
      var quizResponseSummary;
      quizResponseSummary = _.getQuizResponseSummary(model.get('summary_id'));
      return quizResponseSummary.done(function(collection_id) {
        var collectionMeta;
        collectionMeta = _.getCollectionMeta(collection_id);
        return collectionMeta.done(function(collectionMetaData) {
          var check_permissions, qr_id;
          check_permissions = collectionMetaData.permission;
          if (model.get('qr_id') === "" || typeof model.get('qr_id') === 'undefined') {
            qr_id = 'CP' + model.get('content_piece_id') + model.get('summary_id');
            return _.insertIntoQuiZQuestionResponse(model, qr_id);
          } else {
            return _.getOldQuizQuestionResponseData(model, check_permissions);
          }
        });
      });
    },
    getQuizResponseSummary: function(summary_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_response_summary WHERE summary_id = ?", [summary_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result;
          result = data.rows.item(0)['collection_id'];
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseSummary transaction completed');
      }).fail(_.failureHandler);
    },
    insertIntoQuiZQuestionResponse: function(model, qr_id) {
      var question_response;
      question_response = serialize(model.get('question_response'));
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_question_response (qr_id , summary_id, content_piece_id, question_response , time_taken, marks_scored, status, sync) VALUES (?,?,?,?,?,?,?,?)", [qr_id, model.get('summary_id'), model.get('content_piece_id'), question_response, model.get('time_taken'), model.get('marks_scored'), model.get('status'), 0]);
      }, _.transactionErrorhandler, function(tx) {
        console.log('Inserted data in quiz question response');
        return model.set({
          'qr_id': qr_id
        });
      });
    },
    getOldQuizQuestionResponseData: function(model, check_permissions) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE qr_id = ?", [model.get('qr_id')], function(tx, results) {
          var result;
          result = results.rows.item(0);
          console.log(JSON.stringify(result));
          if (result.status === "paused" || model.get('status') === "paused") {
            _.updatePausedQuizQuestionResponseData(model);
          } else if (result.status !== "paused") {
            if (check_permissions.single_attempt === "true") {
              model.set({
                'qr_id': qrId
              });
              model.set({
                'error': 'Permissions denied'
              });
            }
            if (check_permissions.allow_resubmit !== "true" && result.status !== "skipped") {
              model.set({
                'qr_id': qrId
              });
              model.set({
                'error': 'Permissions denied'
              });
            }
          }
          return _.updateQuizQuestionResponseData(model);
        }, _.transactionErrorHandler(error));
      });
    },
    updatePausedQuizQuestionResponseData: function(model) {
      var qrId;
      qrId = model.get('qr_id');
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_question_response SET status=?, time_taken=?, sync=? WHERE summary_id=?", ['paused', model.get('time_taken'), 0, model.get('summary_id')]);
      }, _.transactionErrorhandler, function(tx) {
        model.set({
          'qr_id': qrId
        });
        return console.log('Updated data in quiz_question_response (updatePausedQuizQuestionResponseData)');
      });
    },
    updateQuizQuestionResponseData: function(model) {
      var qrId, question_response;
      qrId = model.get('qr_id');
      question_response = serialize(model.get('question_response'));
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_question_response SET summary_id=?, content_piece_id=?, question_response=? , time_taken=?, marks_scored=?, status=?, sync=? WHERE qr_id=?", [model.get('summary_id'), model.get('content_piece_id'), question_response, model.get('time_taken'), model.get('marks_scored'), model.get('status'), 0, model.get('qr_id')]);
      }, _.transactionErrorhandler, function(tx) {
        model.set({
          'qr_id': qrId
        });
        return console.log('Updated data in quiz_question_response (updateQuizQuestionResponseData)');
      });
    }
  });
});

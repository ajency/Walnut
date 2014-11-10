define(['underscore', 'unserialize', 'serialize'], function(_) {
  return _.mixin({
    getQuizQuestionResponseBySummaryID: function(summary_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getTotalMarksScoredAndTotalTimeTaken(summary_id).then(function(value) {
              result[i] = {
                content_piece_id: row['content_piece_id'],
                marks_scored: value.total_marks_scored,
                qr_id: row['qr_id'],
                question_response: _.unserialize(row['question_response']),
                status: row['status'],
                summary_id: summary_id,
                time_taken: value.total_time_taken
              };
              i = i + 1;
              if (i < data.rows.length) {
                return forEach(data.rows.item(i), i);
              } else {
                console.log("getQuizQuestionResponseBySummaryID done");
                return defer.resolve(result);
              }
            });
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE summary_id = ?", [summary_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTotalMarksScoredAndTotalTimeTaken: function(summary_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result;
        result = '';
        result = data.rows.item(0);
        console.log("getTotalMarksScoredAndTotalTimeTaken done");
        return defer.resolve(result);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT SUM(marks_scored) as total_marks_scored, SUM(CASE WHEN status = 'wrong_answer' THEN marks_scored ELSE 0 END) as negative_scored, SUM(CASE WHEN status <> 'wrong_answer' THEN marks_scored ELSE 0 END) as marks_scored, SUM(time_taken) as total_time_taken FROM " + _.getTblPrefix() + "quiz_question_response WHERE summary_id = ? ", [summary_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    writeQuestionResponse: function(model) {
      return _.getQuizResponseSummary(model.get('summary_id')).then(function(collection_id) {
        return _.getCollectionMeta(collection_id).then(function(collectionMetaData) {
          var check_permissions, qr_id;
          check_permissions = collectionMetaData.permission;
          if (model.get('qr_id') === "" || typeof model.get('qr_id') === 'undefined') {
            qr_id = 'CP' + model.get('content_piece_id') + model.get('summary_id');
            return _.insertIntoQuizQuestionResponse(model, qr_id);
          } else {
            return _.getOldQuizQuestionResponseData(model, check_permissions);
          }
        });
      });
    },
    getQuizResponseSummary: function(summary_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result;
        result = data.rows.item(0)['collection_id'];
        return defer.resolve(result);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_response_summary WHERE summary_id = ?", [summary_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    insertIntoQuizQuestionResponse: function(model, qr_id) {
      var question_response;
      question_response = serialize(model.get('question_response'));
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_question_response (qr_id , summary_id, content_piece_id, question_response , time_taken, marks_scored, status, sync) VALUES (?,?,?,?,?,?,?,?)", [qr_id, model.get('summary_id'), model.get('content_piece_id'), question_response, model.get('time_taken'), model.get('marks_scored'), model.get('status'), 0]);
      }, _.transactionErrorHandler, function(tx) {
        console.log('Inserted data in quiz question response');
        return model.set({
          'qr_id': qr_id
        });
      });
    },
    selectData: function(v) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response ", [], function(tx, results) {
          var i, result, _i, _ref, _results;
          result = new Array();
          _results = [];
          for (i = _i = 0, _ref = results.rows.length - 1; _i <= _ref; i = _i += 1) {
            _results.push(result[i] = results.rows.item(i));
          }
          return _results;
        }, _.transactionErrorHandler);
      });
    },
    getOldQuizQuestionResponseData: function(model, check_permissions) {
      return _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "quiz_question_response WHERE qr_id = ?", [model.get('qr_id')], function(tx, results) {
          var qrId, result;
          qrId = model.get('qr_id');
          result = results.rows.item(0);
          if (result.status === "paused" && model.get('status') === "paused") {
            return _.updatePausedQuizQuestionResponseData(model);
          } else {
            if (result.status !== "paused") {
              if (check_permissions.single_attempt === true) {
                return console.log("Permissions denied");
              } else if (check_permissions.allow_resubmit !== true && result.status !== "skipped") {
                return console.log("Permissions denied");
              } else {
                return _.updateQuizQuestionResponseData(model);
              }
            } else {
              return _.updateQuizQuestionResponseData(model);
            }
          }
        }, _.transactionErrorHandler);
      });
    },
    updatePausedQuizQuestionResponseData: function(model) {
      var qrId;
      qrId = model.get('qr_id');
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_question_response SET status= ?, time_taken= ?, sync= ? WHERE summary_id= ?", ['paused', model.get('time_taken'), 0, model.get('summary_id')]);
      }, _.transactionErrorHandler, function(tx) {
        _.selectData(2);
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
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_question_response SET summary_id=?, content_piece_id=? , question_response=?, time_taken=? , marks_scored=?, status=?, sync=? WHERE qr_id=?", [model.get('summary_id'), model.get('content_piece_id'), question_response, model.get('time_taken'), model.get('marks_scored'), model.get('status'), 0, model.get('qr_id')]);
      }, _.transactionErrorHandler, function(tx) {
        _.selectData(3);
        model.set({
          'qr_id': qrId
        });
        return console.log('Updated data in quiz_question_response (updateQuizQuestionResponseData)');
      });
    }
  });
});

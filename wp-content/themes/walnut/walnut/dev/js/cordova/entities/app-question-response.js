define(['underscore', 'serialize'], function(_) {
  return _.mixin({
    getQuestionResponse: function(collection_id, division) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var questionType;
            questionType = _.getMetaValue(row['content_piece_id']);
            return questionType.done(function(meta_value) {
              return (function(row, i, meta_value) {
                var questionResponseMeta;
                questionResponseMeta = _.getDataFromQuestionResponseMeta(row['ref_id']);
                return questionResponseMeta.done(function(multipleEvalQuestionResponse) {
                  var question_response;
                  if (meta_value.question_type === 'individual') {
                    question_response = _.unserialize(row['question_response']);
                  } else if (meta_value.question_type === 'chorus') {
                    question_response = row['question_response'];
                  } else {
                    question_response = multipleEvalQuestionResponse;
                  }
                  return (function(row, i, question_response) {
                    var teacherName;
                    teacherName = _.getTeacherName(row['teacher_id']);
                    return teacherName.done(function(teacher_name) {
                      console.log('teacher_name: ' + teacher_name);
                      return result[i] = {
                        ref_id: row['ref_id'],
                        teacher_id: row['teacher_id'],
                        teacher_name: teacher_name,
                        content_piece_id: row['content_piece_id'],
                        collection_id: row['collection_id'],
                        division: row['division'],
                        question_response: question_response,
                        time_taken: row['time_taken'],
                        start_date: row['start_date'],
                        end_date: row['end_date'],
                        status: row['status']
                      };
                    });
                  })(row, i, question_response);
                });
              })(row, i, meta_value);
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('getQuestionResponse transaction completed');
      }).fail(_.failureHandler);
    },
    getDataFromQuestionResponseMeta: function(ref_id) {
      var onSuccess, question_response, runQuery;
      question_response = '';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql('SELECT * FROM ' + _.getTblPrefix() + 'question_response_meta WHERE qr_ref_id=?', [ref_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var meta_key, meta_value, row;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            meta_key = row['meta_key'];
            meta_value = _.unserialize(row['meta_value']);
            question_response = _.extend(meta_value, {
              'id': meta_key
            });
          }
          return d.resolve(question_response);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuestionResponseMeta transaction completed');
      }).fail(_.failureHandler);
    },
    getTeacherName: function(teacher_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [teacher_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var display_name;
          display_name = '';
          if (data.rows.length !== 0) {
            display_name = data.rows.item(0)['display_name'];
          }
          return d.resolve(display_name);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTeacherName transaction completed');
      }).fail(_.failureHandler);
    },
    saveUpdateQuestionResponse: function(model) {
      var questionType;
      questionType = _.getMetaValue(model.get('content_piece_id'));
      return questionType.done(function(meta_value) {
        var question_response;
        if (meta_value.question_type === 'individual') {
          question_response = serialize(model.get('question_response'));
        } else if (meta_value.question_type === 'chorus') {
          question_response = model.get('question_response');
        } else {
          question_response = '';
        }
        if (model.has('ref_id')) {
          return _.updateQuestionResponse(model, question_response, meta_value.question_type);
        } else {
          return _.insertQuestionResponse(model, question_response);
        }
      });
    },
    insertQuestionResponse: function(model, question_response) {
      var C, CP, D, record_exists, ref_id, start_date;
      CP = model.get('content_piece_id');
      C = model.get('collection_id');
      D = model.get('division');
      ref_id = 'CP' + CP + 'C' + C + 'D' + D;
      if (!model.get('start_date')) {
        start_date = _.getCurrentDateTime(0);
      } else {
        start_date = model.get('start_date');
      }
      record_exists = _.checkIfRecordExistsInQuestionResponse(ref_id);
      return record_exists.done(function(exists) {
        if (exists) {
          _.db.transaction(function(tx) {
            return tx.executeSql('UPDATE ' + _.getTblPrefix() + 'question_response SET start_date=?, sync=? WHERE ref_id=?', [_.getCurrentDateTime(0), 0, ref_id]);
          }, _.transactionErrorHandler, function(tx) {
            return console.log('SUCCESS: Record exists. Updated record in wp_question_response');
          });
        } else {
          _.db.transaction(function(tx) {
            return tx.executeSql('INSERT INTO ' + _.getTblPrefix() + 'question_response (ref_id, teacher_id, content_piece_id, collection_id, division , question_response, time_taken, start_date, end_date, status, sync) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [ref_id, _.getUserID(), model.get('content_piece_id'), model.get('collection_id'), model.get('division'), question_response, model.get('time_taken'), start_date, model.get('end_date'), model.get('status'), 0]);
          }, _.transactionErrorHandler, function(tx) {
            return console.log('SUCCESS: Inserted record in wp_question_response');
          });
        }
        return model.set({
          'ref_id': ref_id
        });
      });
    },
    updateQuestionResponse: function(model, question_response, question_type) {
      var end_date, multiple_eval_questionResponse;
      if (question_type === 'multiple_eval') {
        multiple_eval_questionResponse = model.get('question_response');
        if (!_.isEmpty(multiple_eval_questionResponse)) {
          _.each(multiple_eval_questionResponse, function(qR, i) {
            var meta_value, student_id;
            student_id = qR['id'];
            qR = _.omit(qR, 'id');
            meta_value = serialize(qR);
            console.log('meta_key in QR: ' + student_id);
            console.log('Meta value in QR: ' + meta_value);
            return _.db.transaction(function(tx) {
              return tx.executeSql('INSERT INTO ' + _.getTblPrefix() + 'question_response_meta (qr_ref_id, meta_key, meta_value, sync) VALUES (?,?,?,?)', [model.get('ref_id'), student_id, meta_value, 0]);
            }, _.transactionErrorHandler, function(tx) {
              return console.log('SUCCESS: Inserted record in wp_question_response_meta');
            });
          });
        }
      }
      end_date = model.get('end_date');
      if (model.get('status') === 'completed') {
        end_date = _.getCurrentDateTime(0);
      }
      return _.db.transaction(function(tx) {
        return tx.executeSql('UPDATE ' + _.getTblPrefix() + 'question_response SET teacher_id=?, question_response=?, time_taken=?, status=? , start_date=?, end_date=?, sync=? WHERE ref_id=?', [_.getUserID(), question_response, model.get('time_taken'), model.get('status'), _.getCurrentDateTime(0), end_date, 0, model.get('ref_id')]);
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: Updated record in wp_question_response');
      });
    },
    checkIfRecordExistsInQuestionResponse: function(ref_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT ref_id FROM " + _.getTblPrefix() + "question_response WHERE ref_id=?", [ref_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var exists;
          exists = false;
          if (data.rows.length > 0) {
            exists = true;
          }
          return d.resolve(exists);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('checkIfRecordExistsInQuestionResponse transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

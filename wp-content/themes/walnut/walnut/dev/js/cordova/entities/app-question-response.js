define(['underscore', 'serialize'], function(_) {
  return _.mixin({
    cordovaQuestionResponseCollection: function(collection_id, division) {
      var defer, result;
      defer = $.Deferred();
      result = [];
      _.getQuestionResponseByCollectionIdAndDivision(collection_id, division).then(function(questionResponseData) {
        var forEach, length;
        console.log('getQuestionResponseByCollectionIdAndDivision done');
        length = questionResponseData.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getMetaValue(row['content_piece_id']).then(function(meta_value) {
              console.log('getMetaValue done');
              return _.getQuestionResponseMetaData(row['ref_id']).then(function(multipleEvalQuestionResponse) {
                console.log('getQuestionResponseMetaData done');
                return _.getTeacherName(row['teacher_id']).then(function(teacher_name) {
                  var question_response;
                  console.log('getTeacherName done');
                  if (meta_value.question_type === 'individual') {
                    question_response = _.unserialize(row['question_response']);
                    question_response = _.map(question_response, function(num) {
                      return parseInt(num);
                    });
                  } else if (meta_value.question_type === 'chorus') {
                    question_response = row['question_response'];
                  } else {
                    question_response = multipleEvalQuestionResponse;
                  }
                  result[i] = {
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
                  i = i + 1;
                  if (i < length) {
                    return forEach(questionResponseData.rows.item(i), i);
                  } else {
                    return defer.resolve(result);
                  }
                });
              });
            });
          };
          return forEach(questionResponseData.rows.item(0), 0);
        }
      });
      return defer.promise();
    },
    getQuestionResponseByCollectionIdAndDivision: function(collection_id, division) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        return defer.resolve(data);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getQuestionResponseMetaData: function(ref_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, length, question_response;
        question_response = [];
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(question_response);
        } else {
          forEach = function(row, i) {
            var meta_key, meta_value;
            meta_key = parseInt(row['meta_key']);
            meta_value = _.unserialize(row['meta_value']);
            question_response[i] = _.extend(meta_value, {
              'id': meta_key
            });
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(question_response);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response_meta WHERE qr_ref_id=?", [ref_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTeacherName: function(teacher_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var display_name;
        display_name = '';
        if (data.rows.length !== 0) {
          display_name = data.rows.item(0)['display_name'];
        }
        return defer.resolve(display_name);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [teacher_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    saveUpdateQuestionResponse: function(model) {
      return _.getMetaValue(model.get('content_piece_id')).done(function(meta_value) {
        var question_response;
        console.log('getMetaValue done');
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
      var C, CP, D, ref_id, start_date;
      CP = model.get('content_piece_id');
      C = model.get('collection_id');
      D = model.get('division');
      ref_id = 'CP' + CP + 'C' + C + 'D' + D;
      if (!model.get('start_date')) {
        start_date = _.getCurrentDateTime(0);
      } else {
        start_date = model.get('start_date');
      }
      return _.checkIfRecordExistsInQuestionResponse(ref_id).done(function(exists) {
        console.log('checkIfRecordExistsInQuestionResponse done');
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
      var end_date;
      _.insertUpdateQuestionResponseMeta(model, question_type);
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
    insertUpdateQuestionResponseMeta: function(model, question_type) {
      var multiple_eval_questionResponse;
      if (question_type === 'multiple_eval') {
        multiple_eval_questionResponse = model.get('question_response');
        if (!_.isEmpty(multiple_eval_questionResponse)) {
          return _.each(multiple_eval_questionResponse, function(qR, i) {
            var meta_value, student_id;
            student_id = qR['id'];
            qR = _.omit(qR, 'id');
            meta_value = serialize(qR);
            return (function(student_id, meta_value) {
              return _.checkIfRecordExistsInQuestionResponseMeta(model.get('ref_id'), student_id).done(function(exists) {
                console.log('checkIfRecordExistsInQuestionResponseMeta done');
                if (exists) {
                  return _.db.transaction(function(tx) {
                    return tx.executeSql('UPDATE ' + _.getTblPrefix() + 'question_response_meta SET meta_value=?, sync=? WHERE qr_ref_id=? AND meta_key=?', [meta_value, 0, model.get('ref_id'), student_id]);
                  }, _.transactionErrorHandler, function(tx) {
                    return console.log('SUCCESS: Updated record in wp_question_response_meta');
                  });
                } else {
                  return _.db.transaction(function(tx) {
                    return tx.executeSql('INSERT INTO ' + _.getTblPrefix() + 'question_response_meta (qr_ref_id, meta_key, meta_value, sync) VALUES (?,?,?,?)', [model.get('ref_id'), student_id, meta_value, 0]);
                  }, _.transactionErrorHandler, function(tx) {
                    return console.log('SUCCESS: Inserted record in wp_question_response_meta');
                  });
                }
              });
            })(student_id, meta_value);
          });
        }
      }
    },
    checkIfRecordExistsInQuestionResponse: function(ref_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var exists;
        exists = false;
        if (data.rows.length > 0) {
          exists = true;
        }
        return defer.resolve(exists);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT ref_id FROM " + _.getTblPrefix() + "question_response WHERE ref_id=?", [ref_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    checkIfRecordExistsInQuestionResponseMeta: function(qr_ref_id, meta_key) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var exists;
        exists = false;
        if (data.rows.length > 0) {
          exists = true;
        }
        return defer.resolve(exists);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT qr_ref_id FROM " + _.getTblPrefix() + "question_response_meta WHERE qr_ref_id=? AND meta_key=?", [qr_ref_id, meta_key], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});

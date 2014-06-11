define(['underscore', 'serialize'], function(_) {
  return _.mixin({
    saveUpdateQuestionResponse: function(model) {
      var questionType;
      questionType = _.getMetaValue(model.get('content_piece_id'));
      return questionType.done(function(meta_value) {
        var question_response;
        if (meta_value.question_type === 'individual') {
          question_response = serialize(model.get('question_response'));
        } else {
          question_response = model.get('question_response');
        }
        if (model.has('ref_id')) {
          return _.updateQuestionResponse(model, question_response);
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
    updateQuestionResponse: function(model, question_response) {
      var end_date;
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

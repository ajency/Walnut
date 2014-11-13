define(['underscore', 'unserialize', 'serialize'], function(_) {
  return _.mixin({
    getQuizResponseSummaryByCollectionIdAndUserID: function(collection_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getQuizResponseSummaryByCollectionId(collection_id).then(function(quiz_responses) {
              console.log(quiz_responses);
              return _.getCountForSkippedQuestion(row['summary_id']).then(function(skipped) {
                console.log(skipped);
                return _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id']).then(function(value) {
                  var quiz_meta, userID;
                  console.log(value);
                  userID = _.getUserID();
                  quiz_meta = _.unserialize(row['quiz_meta']);
                  result[i] = {
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
                  i = i + 1;
                  if (i < data.rows.length) {
                    return forEach(data.rows.item(i), i);
                  } else {
                    console.log("getQuizResponseSummaryByCollectionIdAndUserID done");
                    return defer.resolve(result);
                  }
                });
              });
            });
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT taken_on, quiz_meta, summary_id FROM " + _.getTblPrefix() + "quiz_response_summary WHERE collection_id=? AND student_id=?", [collection_id, _.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getCountForSkippedQuestion: function(summary_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result;
        result = data.rows.item(0)['num_skipped'];
        console.log("getCountForSkippedQuestion done");
        return defer.resolve(result);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT COUNT(status) AS num_skipped FROM " + _.getTblPrefix() + "quiz_question_response WHERE status = ? AND summary_id = ?", ['skipped', summary_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    writeQuizResponseSummary: function(model) {
      var quizMeta, quizMetaValue;
      quizMetaValue = '';
      quizMeta = '';
      return _.getCollectionMeta(model.get('collection_id')).then(function(collectionMetaData) {
        if (collectionMetaData.quizType === "practice") {
          quizMetaValue = model.get('status');
          quizMeta = {
            'status': quizMetaValue
          };
        } else {
          quizMetaValue = model.get('status');
          quizMeta = {
            'status': quizMetaValue
          };
        }
        if (model.get('summary_id') === "" || typeof model.get('summary_id') === 'undefined') {
          return _.insertIntoQuizResponseSummary(model, quizMeta, collectionMetaData);
        } else {
          return _.updateIntoQuizResponseSummary(model, quizMeta);
        }
      });
    },
    insertIntoQuizResponseSummary: function(model, quizMetaValue, collectionMetaData) {
      var addDateAndTime, serializeQuizMetaValue, start_date, summary_id;
      summary_id = 'Q' + model.get('collection_id') + 'S' + _.getUserID();
      if (collectionMetaData.quizType === "practice") {
        addDateAndTime = _.getCurrentDateTime(2).replace(/[:  -]/g, '');
        summary_id = summary_id + '_' + addDateAndTime;
      }
      console.log(JSON.stringify(quizMetaValue));
      model.set({
        'summary_id': summary_id
      });
      serializeQuizMetaValue = serialize(quizMetaValue);
      start_date = _.getCurrentDateTime(0);
      return _.db.transaction(function(tx) {
        return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_response_summary (summary_id, collection_id, student_id, quiz_meta, taken_on, sync) VALUES (?,?,?,?,?,?)", [summary_id, model.get('collection_id'), _.getUserID(), serializeQuizMetaValue, start_date, 0]);
      }, _.transactionErrorHandler, function(tx) {
        return console.log('Inserted data in quiz_response_summary');
      });
    },
    updateIntoQuizResponseSummary: function(model, quizMeta) {
      var serializeQuizMetaValue, summary_id;
      summary_id = model.get('summary_id');
      serializeQuizMetaValue = serialize(quizMeta);
      return _.db.transaction(function(tx) {
        return tx.executeSql("UPDATE " + _.getTblPrefix() + "quiz_response_summary SET quiz_meta=?, sync=? WHERE summary_id=?", [serializeQuizMetaValue, 0, summary_id]);
      }, _.transactionErrorHandler, function(tx) {
        return console.log('Updated data in quiz_response_summary');
      });
    }
  });
});

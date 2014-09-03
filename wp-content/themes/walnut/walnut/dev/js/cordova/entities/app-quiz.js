define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getQuizByTextbookIdAndUserID: function(textbookId) {
      var onSuccess, runQuery;
      runQuery = function() {
        var pattern;
        pattern = '%"' + textbookId + '"%';
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND post_status IN ('publish', 'archive') AND type=?", ['quiz'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var metaKeyDescriptionAndContentLayout;
            metaKeyDescriptionAndContentLayout = _.getMetaKeyDescriptionAndContentLayout(row['id']);
            return metaKeyDescriptionAndContentLayout.done(function(metaKeyDescriptionContentLayout) {
              var contentLayout, description, quizType;
              quizType = contentLayout = description = '';
              quizType = metaKeyDescriptionContentLayout.quizType;
              console.log(quizType);
              contentLayout = _.unserialize(metaKeyDescriptionContentLayout.contentLayout);
              description = _.unserialize(metaKeyDescriptionContentLayout.description);
              return (function(row, i, quizType, contentLayout, description) {
                var dateAndStatus;
                dateAndStatus = _.getStartDateAndStatus(row['id']);
                dateAndStatus.done(function(dateStatus) {
                  var date, status;
                  status = dateStatus.status;
                  return date = dateStatus.start_date;
                });
                if (!(row['post_status'] === 'archive' && status === 'not started')) {
                  console.log(JSON.stringify({
                    id: row['id']
                  }));
                  console.log(JSON.stringify({
                    name: row['name']
                  }));
                  console.log(JSON.stringify({
                    training_date: date
                  }));
                  console.log(JSON.stringify({
                    content_layout: contentLayout
                  }));
                  console.log(JSON.stringify({
                    description: description
                  }));
                  console.log(JSON.stringify({
                    post_status: row['post_status']
                  }));
                  data = {
                    id: row['id'],
                    name: row['name'],
                    created_on: row['created_on'],
                    created_by: row['created_by'],
                    last_modified_on: row['last_modified_on'],
                    last_modified_by: row['last_modified_by'],
                    published_on: row['published_on'],
                    published_by: row['published_by'],
                    type: row['type'],
                    term_ids: _.unserialize(row['term_ids']),
                    duration: _.getDuration(row['duration']),
                    minshours: _.getMinsHours(row['duration']),
                    total_minutes: row['duration'],
                    quiz_type: quizType,
                    content_layout: contentLayout,
                    training_date: date,
                    description: description,
                    post_status: row['post_status']
                  };
                  console.log(JSON.stringify(data));
                  return result.push(data);
                }
              })(row, i, quizType, contentLayout, description);
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          console.log(JSON.stringify(result));
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('getContentGroupByTextbookIdAndDivision transaction completed');
      }).fail(_.failureHandler);
    },
    getStartDateAndStatus: function(collection_id) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var data, quizResponseSummary;
          data = {
            start_date: '',
            status: ''
          };
          quizResponseSummary = _.getQuizResponseSummary(collection_id);
          return quizResponseSummary.done(function(quiz_responses) {
            var contentLayoutValue;
            contentLayoutValue = '';
            contentLayoutValue = _.unserialize(quiz_responses.quiz_meta);
            if (contentLayoutValue.status !== "started" || contentLayoutValue.status !== "completed") {
              data.status = 'not started';
            }
            if (contentLayoutValue.status === "started") {
              data.status = 'started';
              data.start_date = quiz_responses.taken_on;
            }
            if (contentLayoutValue.status === 'completed') {
              data.status = 'completed';
              data.start_date = quiz_responses.taken_on;
            }
            return d.resolve(data);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getStartDateAndStatus done');
      }).fail(_.failureHandler);
    },
    getQuizResponseSummary: function(collection_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT taken_on, quiz_meta FROM " + _.getTblPrefix() + "quiz_response_summary WHERE collection_id=? AND student_id=?", [collection_id, _.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result;
          result = data.rows.item(0);
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseSummary transaction completed');
      }).fail(_.failureHandler);
    },
    getMetaKeyDescriptionAndContentLayout: function(collection_id) {
      var metaKeyDescriptionAndContentLayout, onSuccess, runQuery;
      metaKeyDescriptionAndContentLayout = {
        quizType: '',
        contentLayout: '',
        description: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, row, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            if (row['meta_key'] === 'quiz_type') {
              metaKeyDescriptionAndContentLayout.quizType = row['meta_value'];
            }
            if (row['meta_key'] === 'content_layout') {
              metaKeyDescriptionAndContentLayout.contentLayout = row['meta_value'];
            }
            if (row['meta_key'] === 'description') {
              metaKeyDescriptionAndContentLayout.description = row['meta_value'];
            }
          }
          return d.resolve(metaKeyDescriptionAndContentLayout);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaKeyDescriptionAndContentLayout transaction completed');
      }).fail(_.failureHandler);
    },
    getDuration: function(duration) {
      if (duration > 60) {
        return duration / 60;
      } else {
        return duration;
      }
    },
    getMinsHours: function(duration) {
      if (duration > 60) {
        return 'hrs';
      } else {
        return 'mins';
      }
    }
  });
});

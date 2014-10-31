define(['underscore'], function(_) {
  return _.mixin({
    cordovaTextbookCollection: function() {
      var defer;
      defer = $.Deferred();
      _.getClassIdForUser().then(function(class_id) {
        console.log('getClassIdForUser transaction completed');
        return _.getTextbooksForStudent(class_id).then(function(data) {
          console.log('getTextbooksForStudent transaction completed');
          return defer.resolve(data);
        });
      });
      return defer.promise();
    },
    getClassIdForUser: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var class_id;
        class_id = data.rows.item(0)['meta_value'];
        return defer.resolve(class_id);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key=? AND user_id=?", ['student_division', _.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextbooksForStudent: function(class_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        forEach = function(row, i) {
          return _.getTextbookOptions(row['term_id']).then(function(options) {
            console.log('getTextbookOptions transaction completed');
            return _.getChapterCount(row['term_id']).then(function(chapter_count) {
              console.log('getChapterCount transaction completed');
              return _.getPracticeAndTotalQuiz(row['textbook_id']).then(function(total_quiz_count) {
                console.log('getPracticeAndTotalQuiz transaction completed');
                return _.getPracticeCompletedQuizCount(row['textbook_id']).then(function(practice_quizzes_completed) {
                  var class_test_not_started, practice_not_started;
                  console.log('getPracticeCompletedQuizCount transaction completed');
                  class_test_not_started = total_quiz_count.class_test - (practice_quizzes_completed.class_test_completed + practice_quizzes_completed.class_test_in_progress);
                  practice_not_started = total_quiz_count.practice - (practice_quizzes_completed.practice_completed + practice_quizzes_completed.practice_in_progress);
                  result[i] = {
                    term_id: row["term_id"],
                    name: row["name"],
                    class_test_count: total_quiz_count.class_test,
                    class_test_completed: practice_quizzes_completed.class_test_completed,
                    class_test_not_started: class_test_not_started,
                    slug: row["slug"],
                    term_group: row["term_group"],
                    term_taxonomy_id: row["term_taxonomy_id"],
                    taxonomy: row["taxonomy"],
                    description: row["description"],
                    parent: row["parent"],
                    count: row["count"],
                    classes: _.unserialize(row["class_id"]),
                    subjects: _.unserialize(row["tags"]),
                    author: options.author,
                    thumbnail: options.attachmenturl,
                    cover_pic: options.attachmenturl,
                    filter: 'raw',
                    chapter_count: chapter_count,
                    practice_count: total_quiz_count.practice,
                    practice_completed: practice_quizzes_completed.practice_completed,
                    practice_not_started: practice_not_started
                  };
                  i = i + 1;
                  if (i < data.rows.length) {
                    return forEach(data.rows.item(i), i);
                  } else {
                    return defer.resolve(result);
                  }
                });
              });
            });
          });
        };
        return forEach(data.rows.item(0), 0);
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + class_id + '"%';
        return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND wtr.class_id LIKE '%" + pattern + "%' ", [], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextbookOptions: function(id) {
      var defer, onSuccess, options;
      defer = $.Deferred();
      options = {
        author: '',
        attachmenturl: ''
      };
      onSuccess = function(tx, data) {
        var attachmenturl, directoryPath, option_value, url;
        if (data.rows.length !== 0) {
          option_value = _.unserialize(data.rows.item(0)['option_value']);
          url = option_value.attachmenturl;
          if (url === 'false') {
            attachmenturl = '';
          } else {
            directoryPath = _.getSynapseMediaDirectoryPath();
            attachmenturl = directoryPath + url.substr(url.indexOf("uploads/"));
            attachmenturl = '<img src="' + attachmenturl + '" onerror="this.onerror=null;this.src=\'/images/img-not-found.jpg\';">';
          }
          options = {
            author: option_value.author,
            attachmenturl: attachmenturl
          };
          return defer.resolve(options);
        } else {
          return defer.resolve(options);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT option_value FROM wp_options WHERE option_name=?", ['taxonomy_' + id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getPracticeAndTotalQuiz: function(textbook_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var total_count;
        total_count = data.rows.item(0);
        return defer.resolve(total_count);
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + textbook_id + '"%';
        return tx.executeSql("SELECT SUM( CASE WHEN m.meta_value = 'practice' THEN 1 ELSE 0 END ) AS practice, SUM( CASE WHEN m.meta_value = 'test' THEN 1 ELSE 0 END ) AS class_test FROM wp_content_collection c, wp_collection_meta m WHERE c.term_ids LIKE '" + pattern + "' AND c.post_status=? AND c.type=? AND c.id = m.collection_id AND m.meta_key=? ", ['publish', 'quiz', 'quiz_type'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getPracticeCompletedQuizCount: function(textbook_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var class_test_completed, class_test_in_progress, forEach, practice_completed, practice_in_progress, practice_quizzes_completed;
        practice_quizzes_completed = new Array();
        class_test_completed = new Array();
        practice_completed = new Array();
        class_test_in_progress = new Array();
        practice_in_progress = new Array();
        forEach = function(row, i) {
          var count_practice_completed, count_practice_in_progress, quiz_meta, status;
          quiz_meta = _.unserialize(row['quiz_meta']);
          status = quiz_meta['status'];
          if (status === 'completed') {
            if (row['quiz_type'] === 'test') {
              class_test_completed[i] = row['id'];
            } else {
              practice_completed[i] = row['id'];
            }
          } else {
            if (row['quiz_type'] === 'test') {
              class_test_in_progress[i] = row['id'];
            } else {
              practice_in_progress[i] = row['id'];
            }
          }
          i = i + 1;
          if (i < data.rows.length) {
            return forEach(data.rows.item(i), i);
          } else {
            if (practice_completed.length > 0) {
              count_practice_completed = _.uniq(practice_completed);
            }
            if (practice_in_progress.length > 0) {
              count_practice_in_progress = _.uniq(practice_in_progress);
            }
            practice_quizzes_completed = {
              class_test_completed: _.size(_.values(class_test_completed)),
              practice_completed: _.size(count_practice_completed),
              class_test_in_progress: _.size(_.values(class_test_in_progress)),
              practice_in_progress: _.size(count_practice_in_progress)
            };
            return defer.resolve(practice_quizzes_completed);
          }
        };
        return forEach(data.rows.item(0), 0);
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + textbook_id + '"%';
        return tx.executeSql("SELECT cc.id, cm.meta_value as quiz_type, qr.quiz_meta FROM " + _.getTblPrefix() + "quiz_response_summary qr, wp_content_collection cc, wp_collection_meta cm WHERE qr.collection_id = cc.id AND cm.collection_id = cc.id AND cm.meta_key LIKE '%quiz_type%' AND cc.post_status IN ('publish','archive') AND qr.student_id = ? AND cc.term_ids LIKE '" + pattern + "' ", [_.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextBookByTextbookId: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND tt.term_id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result, row;
          row = data.rows.item(0);
          result = {
            term_id: row["term_id"],
            name: row["name"],
            slug: row["slug"],
            term_group: row["term_group"],
            term_order: row["term_order"],
            term_taxonomy_id: row["term_taxonomy_id"],
            taxonomy: row["taxonomy"],
            description: row["description"],
            parent: row["parent"],
            count: row["count"],
            classes: _.unserialize(row["class_id"]),
            subjects: _.unserialize(row["tags"])
          };
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('getTextBookByTextbookId transaction completed');
      }).fail(_.failureHandler);
    },
    getTextBookNamesByTermIDs: function(ids) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT term_id, name FROM wp_terms WHERE term_id IN (" + ids + ")", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _i, _ref;
          result = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            result[i] = {
              id: row['term_id'],
              name: row['name']
            };
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTextBookNamesByTermIDs transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

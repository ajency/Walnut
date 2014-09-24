define(['underscore'], function(_) {
  return _.mixin({
    getTextbooksForStudent: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          var classID;
          classID = _.getClassIdForUser();
          return classID.done(function(class_id) {
            return _.db.transaction(function(tx) {
              var pattern;
              pattern = '%"' + class_id + '"%';
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND wtr.class_id LIKE '%" + pattern + "%' ", [], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var modulesCount;
            modulesCount = _.getModulesCount(row['textbook_id']);
            return modulesCount.done(function(modules_count) {
              return (function(row, i, modules_count) {
                var textbookOptions;
                textbookOptions = _.getTextbookOptions(row['term_id']);
                return textbookOptions.done(function(options) {
                  return (function(row, i, modules_count, options) {
                    var chapterCount;
                    chapterCount = _.getChapterCount(row['term_id']);
                    return chapterCount.done(function(chapter_count) {
                      return (function(row, i, modules_count, options, chapter_count) {
                        var practiceAndTotalQuiz;
                        practiceAndTotalQuiz = _.getPracticeAndTotalQuiz(row['textbook_id']);
                        return practiceAndTotalQuiz.done(function(total_quiz_count) {
                          return (function(row, i, modules_count, options, chapter_count, total_quiz_count) {
                            var completedQuizCount;
                            completedQuizCount = _.getCompletedQuizCount(row['textbook_id']);
                            return completedQuizCount.done(function(quizzes_completed) {
                              return result[i] = {
                                term_id: row["term_id"],
                                name: row["name"],
                                class_test_count: total_quiz_count.class_test,
                                slug: row["slug"],
                                term_group: row["term_group"],
                                term_taxonomy_id: row["term_taxonomy_id"],
                                taxonomy: row["taxonomy"],
                                description: row["description"],
                                parent: row["parent"],
                                practice_count: total_quiz_count.practice,
                                count: row["count"],
                                classes: _.unserialize(row["class_id"]),
                                subjects: _.unserialize(row["tags"]),
                                author: options.author,
                                thumbnail: options.attachmenturl,
                                cover_pic: options.attachmenturl,
                                filter: 'raw',
                                chapter_count: chapter_count,
                                quizzes_completed: quizzes_completed,
                                quizzes_not_started: total_quiz_count.class_test - quizzes_completed
                              };
                            });
                          })(row, i, modules_count, options, chapter_count, total_quiz_count);
                        });
                      })(row, i, modules_count, options, chapter_count);
                    });
                  })(row, i, modules_count, options);
                });
              })(row, i, modules_count);
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
        return console.log('getTextbooksForStudent transaction completed');
      }).fail(_.failureHandler);
    },
    getClassIdForUser: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key=? AND user_id=?", ['student_division', _.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var class_id;
          class_id = data.rows.item(0)['meta_value'];
          console.log(class_id);
          return d.resolve(class_id);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getClassIdForUser transaction completed');
      }).fail(_.failureHandler);
    },
    getModulesCount: function(textbook_id) {
      var onSuccess, pattern, runQuery;
      pattern = '%"' + textbook_id + '"%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(id) AS count FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND post_status=? AND type=?", ['publish', 'quiz'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var modules_count;
          modules_count = data.rows.item(0)['count'];
          return d.resolve(modules_count);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getModulesCount transaction completed');
      }).fail(_.failureHandler);
    },
    getPracticeAndTotalQuiz: function(textbook_id) {
      var onSuccess, pattern, runQuery;
      pattern = '%"' + textbook_id + '"%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT SUM( CASE WHEN m.meta_value = 'practice' THEN 1 ELSE 0 END ) as practice , SUM( CASE WHEN m.meta_value = 'test' THEN 1 ELSE 0 END ) as class_test FROM wp_content_collection c , wp_collection_meta m WHERE c.term_ids LIKE '" + pattern + "' AND c.post_status=? AND c.type=? AND c.id = m.collection_id AND m.meta_key=? ", ['publish', 'quiz', 'quiz_type'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var total_count;
          total_count = data.rows.item(0);
          console.log(total_count);
          return d.resolve(total_count);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getPracticeAndTotalQuiz transaction completed');
      }).fail(_.failureHandler);
    },
    getCompletedQuizCount: function(textbook_id) {
      var onSuccess, pattern, runQuery;
      pattern = '%"' + textbook_id + '"%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(distinct(qr.collection_id)) AS completed_quiz_count FROM " + _.getTblPrefix() + "quiz_response_summary qr, wp_content_collection cc , wp_collection_meta m WHERE qr.collection_id = cc.id AND qr.student_id = ? AND cc.post_status in ('publish','archive') AND qr.quiz_meta LIKE '%completed%' AND cc.term_ids LIKE '" + pattern + "' AND m.meta_value=? ", [_.getUserID(), 'test'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var quizzes_completed;
          quizzes_completed = data.rows.item(0)['completed_quiz_count'];
          console.log(quizzes_completed);
          return d.resolve(quizzes_completed);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getCompletedQuizCount transaction completed');
      }).fail(_.failureHandler);
    },
    getTextbookOptions: function(id) {
      var onSuccess, options, runQuery;
      options = {
        author: '',
        attachmenturl: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT option_value FROM wp_options WHERE option_name=?", ['taxonomy_' + id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
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
            return d.resolve(options);
          } else {
            return d.resolve(options);
          }
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTextbookOptions transaction completed');
      }).fail(_.failureHandler);
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

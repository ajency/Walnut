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
                        var completedQuizCount;
                        completedQuizCount = _.getCompletedQuizCount(row['textbook_id']);
                        return completedQuizCount.done(function(quizzes_completed) {
                          return result[i] = {
                            term_id: row["term_id"],
                            name: row["name"],
                            slug: row["slug"],
                            term_group: row["term_group"],
                            term_taxonomy_id: row["term_taxonomy_id"],
                            taxonomy: row["taxonomy"],
                            description: row["description"],
                            parent: row["parent"],
                            count: row["count"],
                            classes: _.unserialize(row["class_id"]),
                            subjects: _.unserialize(row["tags"]),
                            modules_count: modules_count,
                            author: options.author,
                            thumbnail: options.attachmenturl,
                            cover_pic: options.attachmenturl,
                            filter: 'raw',
                            chapter_count: chapter_count,
                            quizzes_completed: quizzes_completed,
                            quizzes_not_started: modules_count - quizzes_completed
                          };
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
    getCompletedQuizCount: function(textbook_id) {
      var onSuccess, pattern, runQuery;
      pattern = '%"' + textbook_id + '"%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(qr.collection_id) AS completed_quiz_count FROM wp_quiz_response_summary qr, wp_content_collection cc WHERE qr.collection_id = cc.id AND qr.student_id = ? AND qr.quiz_meta= ? AND cc.term_ids LIKE '" + pattern + "' ", [_.getUserID(), 'completed'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var quizzes_completed;
          quizzes_completed = data.rows.item(0)['completed_quiz_count'];
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
    }
  });
});

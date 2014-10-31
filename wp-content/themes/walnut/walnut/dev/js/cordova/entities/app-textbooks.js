define(['underscore'], function(_) {
  return _.mixin({
    cordovaTextbookCollection: function(class_id, division) {
      var defer, result;
      defer = $.Deferred();
      result = [];
      _.getTextbooksByClassIdAndDivision(class_id, division).then(function(textbookData) {
        var forEach;
        console.log('getTextbooksByClassIdAndDivision done');
        forEach = function(row, i) {
          return _.getModulesCount(row['textbook_id']).then(function(modules_count) {
            console.log('getModulesCount done');
            return _.getTextbookOptions(row['term_id']).then(function(options) {
              console.log('getTextbookOptions done');
              return _.getChapterCount(row['term_id']).then(function(chapter_count) {
                console.log('getChapterCount done');
                result[i] = {
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
                  chapter_count: chapter_count
                };
                i = i + 1;
                if (i < textbookData.rows.length) {
                  return forEach(textbookData.rows.item(i), i);
                } else {
                  return defer.resolve(result);
                }
              });
            });
          });
        };
        return forEach(textbookData.rows.item(0), 0);
      });
      return defer.promise();
    },
    getTextBookIds: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var ids;
        ids = _.unserialize(data.rows.item(0)['meta_value']);
        ids = _.compact(ids);
        return defer.resolve(ids);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key=? AND user_id=?", ['textbooks', _.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextbooksByClassIdAndDivision: function(class_id, division) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        return defer.resolve(data);
      };
      _.getTextBookIds().then(function(textbook_ids) {
        console.log('getTextBookIds done');
        return _.db.transaction(function(tx) {
          var pattern;
          pattern = '%"' + class_id + '"%';
          return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND wtr.class_id LIKE '" + pattern + "' AND wtr.textbook_id IN (" + textbook_ids + ")", [], onSuccess, _.transactionErrorHandler);
        });
      });
      return defer.promise();
    },
    getModulesCount: function(textbook_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var modules_count;
        modules_count = data.rows.item(0)['count'];
        return defer.resolve(modules_count);
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + textbook_id + '"%';
        return tx.executeSql("SELECT COUNT(id) AS count FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND status=?", ['publish'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextbookOptions: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var attachmenturl, directoryPath, option_value, options, url;
        options = {
          author: '',
          attachmenturl: ''
        };
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
    },
    getCountOfChaptersStatuses: function(textbook_id, division) {
      var defer;
      defer = $.Deferred();
      _.getStatusForTextbook(textbook_id, division).then(function(status) {
        var chapterStatusCount;
        console.log('getStatusForTextbook done');
        chapterStatusCount = {
          chapters_completed: _.size(status.completed),
          chapters_in_progress: _.size(status.in_progress),
          chapters_not_started: _.size(status.not_started)
        };
        return defer.resolve(chapterStatusCount);
      });
      return defer.promise();
    },
    getStatusForTextbook: function(textbook_id, division) {
      var defer, textbookStatus;
      defer = $.Deferred();
      textbookStatus = {
        completed: [],
        in_progress: [],
        not_started: []
      };
      _.getChaptersByParentId(textbook_id).then(function(chapters) {
        var forEach;
        console.log('getChaptersByParentId done');
        forEach = function(chapter, i) {
          var chapterId;
          chapterId = chapter.term_id;
          return _.getStatusForChapter(chapterId, division).then(function(result) {
            console.log('getStatusForChapter done');
            if (_.size(result.all_modules) === _.size(result.completed)) {
              textbookStatus.completed.push(chapterId);
            } else if (_.size(result.in_progress) > 0) {
              textbookStatus.in_progress.push(chapterId);
            } else {
              textbookStatus.not_started.push(chapterId);
            }
            i = i + 1;
            if (i < chapters.length) {
              return forEach(chapters[i], i);
            } else {
              return defer.resolve(textbookStatus);
            }
          });
        };
        return forEach(chapters[0], 0);
      });
      return defer.promise();
    },
    getStatusForChapter: function(chapter_id, division) {
      var chapterStatus, onSuccess, runQuery;
      chapterStatus = {
        all_modules: [],
        completed: [],
        in_progress: [],
        not_started: []
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            var pattern;
            pattern = '%"' + chapter_id + '"%';
            return tx.executeSql("SELECT id FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND status=?", ['publish'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, row, _fn, _i, _ref;
          _fn = function(row, i) {
            var contentPieces;
            chapterStatus.all_modules[i] = row['id'];
            contentPieces = _.getContentPiecesAndDescription(row['id']);
            return contentPieces.done(function(result) {
              var content_pieces;
              content_pieces = _.unserialize(result.content_pieces);
              return (function(row, content_pieces) {
                var moduleStatus;
                moduleStatus = _.getDateAndStatus(row['id'], division, content_pieces);
                return moduleStatus.done(function(result) {
                  var status;
                  status = result.status;
                  if (status === 'completed') {
                    return chapterStatus.completed.push(row['id']);
                  } else if (status === 'started') {
                    return chapterStatus.in_progress.push(row['id']);
                  } else {
                    return chapterStatus.not_started.push(row['id']);
                  }
                });
              })(row, content_pieces);
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(chapterStatus);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getStatusForChapter transaction completed');
      }).fail(_.failureHandler);
    }
  });
});

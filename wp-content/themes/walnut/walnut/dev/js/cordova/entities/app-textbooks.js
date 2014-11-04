define(['underscore'], function(_) {
  return _.mixin({
    cordovaTextbookCollection: function(class_id, division) {
      var defer, result;
      defer = $.Deferred();
      result = [];
      _.getTextbooksByClassIdAndDivision(class_id, division).then(function(textbookData) {
        var forEach, length;
        console.log('getTextbooksByClassIdAndDivision done');
        length = textbookData.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getModulesCount(row['textbook_id']).then(function(modules_count) {
              console.log('getModulesCount done');
              return _.getTextbookOptions(row['term_id']).then(function(options) {
                console.log('getTextbookOptions done');
                return _.getChapterCount(row['term_id']).then(function(chapter_count) {
                  console.log('getChapterCount done');
                  return _.getCountOfChaptersStatuses(row['term_id'], division).then(function(chptStsCnt) {
                    console.log('getCountOfChaptersStatuses done');
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
                      chapter_count: chapter_count,
                      chapters_completed: chptStsCnt.completed,
                      chapters_in_progress: chptStsCnt.in_progress,
                      chapters_not_started: chptStsCnt.not_started
                    };
                    i = i + 1;
                    if (i < length) {
                      return forEach(textbookData.rows.item(i), i);
                    } else {
                      return defer.resolve(result);
                    }
                  });
                });
              });
            });
          };
          return forEach(textbookData.rows.item(0), 0);
        }
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
    getCountOfChaptersStatuses: function(textbook_id, division) {
      var defer;
      defer = $.Deferred();
      _.getStatusForTextbook(textbook_id, division).then(function(status) {
        var chapterStatusCount;
        console.log('getStatusForTextbook done');
        chapterStatusCount = {
          completed: _.size(status.completed),
          in_progress: _.size(status.in_progress),
          not_started: _.size(status.not_started)
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
        var forEach, length;
        console.log('getChaptersByParentId done');
        length = chapters.length;
        if (length === 0) {
          return defer.resolve(textbookStatus);
        } else {
          forEach = function(chapter, i) {
            var chapterId;
            chapterId = chapter.term_id;
            return _.getStatusForChapter(chapterId, division).then(function(result) {
              console.log('getStatusForChapter done');
              if (_.size(result.all_modules) === 0) {
                textbookStatus.not_started.push(chapterId);
              } else if (_.size(result.all_modules) === _.size(result.completed)) {
                textbookStatus.completed.push(chapterId);
              } else if (_.size(result.in_progress) > 0 || _.size(result.completed) > 0) {
                textbookStatus.in_progress.push(chapterId);
              } else {
                textbookStatus.not_started.push(chapterId);
              }
              i = i + 1;
              if (i < length) {
                return forEach(chapters[i], i);
              } else {
                return defer.resolve(textbookStatus);
              }
            });
          };
          return forEach(chapters[0], 0);
        }
      });
      return defer.promise();
    },
    getStatusForChapter: function(chapter_id, division) {
      var chapterStatus, defer, onSuccess;
      defer = $.Deferred();
      chapterStatus = {
        all_modules: [],
        completed: [],
        in_progress: [],
        not_started: []
      };
      onSuccess = function(tx, data) {
        var forEach, length;
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(chapterStatus);
        } else {
          forEach = function(row, i) {
            chapterStatus.all_modules[i] = row['id'];
            return _.getContentPiecesAndDescription(row['id']).then(function(contentPiecesAndDescription) {
              var content_pieces;
              console.log('getContentPiecesAndDescription done');
              content_pieces = _.unserialize(contentPiecesAndDescription.content_pieces);
              return _.getDateAndStatus(row['id'], division, content_pieces).then(function(dateAndStatus) {
                var status;
                console.log('getDateAndStatus done');
                status = dateAndStatus.status;
                if (status === 'completed') {
                  chapterStatus.completed.push(row['id']);
                } else if (status === 'started') {
                  chapterStatus.in_progress.push(row['id']);
                } else {
                  chapterStatus.not_started.push(row['id']);
                }
                i = i + 1;
                if (i < length) {
                  return forEach(data.rows.item(i), i);
                } else {
                  return defer.resolve(chapterStatus);
                }
              });
            });
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + chapter_id + '"%';
        return tx.executeSql("SELECT id FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND status=? AND type=?", ['publish', 'teaching-module'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextBookByTextbookId: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
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
        return defer.resolve(result);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND tt.term_id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getTextBookNamesByTermIDs: function(ids) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, length, result;
        result = [];
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            result[i] = {
              id: row['term_id'],
              name: row['name']
            };
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(result);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT term_id, name FROM wp_terms WHERE term_id IN (" + ids + ")", [], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});

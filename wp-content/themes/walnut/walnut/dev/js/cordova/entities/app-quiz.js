var __slice = [].slice;

define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getQuizByTextbookId: function(textbookId) {
      var defer, onSuccess, pattern;
      defer = $.Deferred();
      pattern = '%"' + textbookId + '"%';
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getCollectionMeta(row['id']).then(function(collectionMetaData) {
              return _.getStartDateAndStatus(row['id']).then(function(dateStatus) {
                return _.getQuizSchedule(row['id']).then(function(schedule) {
                  var marks;
                  if (collectionMetaData.marks) {
                    marks = parseFloat(collectionMetaData.marks);
                  } else {
                    marks = collectionMetaData.marks;
                  }
                  result[i] = {
                    id: row['id'],
                    name: row['name'],
                    created_on: row['created_on'],
                    created_by: row['created_by'],
                    last_modified_on: row['last_modified_on'],
                    last_modified_by: row['last_modified_by'],
                    published_on: row['published_on'],
                    published_by: row['published_by'],
                    post_status: row['post_status'],
                    type: row['type'],
                    term_ids: _.unserialize(row['term_ids']),
                    duration: _.getDuration(row['duration']),
                    minshours: _.getMinsHours(row['duration']),
                    total_minutes: row['duration'],
                    description: "",
                    permissions: collectionMetaData.permission,
                    instructions: collectionMetaData.instructions,
                    quiz_type: collectionMetaData.quizType,
                    marks: marks,
                    negMarksEnable: collectionMetaData.negMarksEnable,
                    negMarks: collectionMetaData.negMarks,
                    message: collectionMetaData.message,
                    content_layout: "",
                    taken_on: dateStatus.start_date,
                    status: dateStatus.status,
                    attempts: dateStatus.attempts,
                    content_pieces: collectionMetaData.contentPieces,
                    schedule: schedule
                  };
                  i = i + 1;
                  if (i < data.rows.length) {
                    return forEach(data.rows.item(i), i);
                  } else {
                    console.log("getQuizByTextbookId done");
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
        return tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND post_status IN ('publish', 'archive') AND type=? ", ['quiz'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getCollectionMeta: function(collection_id) {
      var defer, deferreds, onSuccess, result;
      defer = $.Deferred();
      deferreds = [];
      result = {
        quizType: '',
        contentPieces: '',
        instructions: '',
        permission: '',
        marks: '',
        negMarks: '',
        negMarksEnable: '',
        message: ''
      };
      onSuccess = function(tx, data) {
        var forEach;
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            var def, description, quiz_meta;
            if (row['meta_key'] === 'quiz_type') {
              result.quizType = row['meta_value'];
            }
            if (row['meta_key'] === 'description') {
              description = _.unserialize(row['meta_value']);
              result.instructions = description.instruction;
            }
            if (row['meta_key'] === 'permissions') {
              result.permission = _.unserialize(row['meta_value']);
            }
            if (row['meta_key'] === 'quiz_meta') {
              quiz_meta = _.unserialize(row['meta_value']);
              result.marks = quiz_meta.marks;
              result.negMarks = quiz_meta.negMarks;
              result.negMarksEnable = quiz_meta.negMarksEnable;
              result.message = quiz_meta.message;
            }
            if (row['meta_key'] === 'content_layout') {
              def = _.getContentPiecesFromContentLayout(row['meta_value']);
              deferreds.push(def);
            }
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              if (deferreds.length === 0) {
                return defer.resolve(result);
              } else {
                return $.when.apply($, deferreds).done(function() {
                  var content_pieces;
                  content_pieces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                  _.each(content_pieces, function(contentPiece) {
                    return result.contentPieces = contentPiece;
                  });
                  console.log("getCollectionMeta done");
                  return defer.resolve(result);
                });
              }
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id = ?", [collection_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getContentPiecesFromContentLayout: function(contentLayout) {
      var content_layout, content_pieces, defer, deferreds, forEach;
      content_pieces = [];
      content_layout = _.unserialize(contentLayout);
      deferreds = [];
      defer = $.Deferred();
      if (contentLayout.length === 0) {
        defer.resolve(content_pieces);
      } else {
        forEach = function(content, key) {
          var def;
          if (content.type === "content-piece") {
            if (content.id) {
              content_pieces.push(parseInt(content.id));
            }
          } else if (content.type === "content_set") {
            def = _.generateSetItems(content, content_pieces);
            deferreds.push(def);
          }
          key = key + 1;
          if (key < content_layout.length) {
            return forEach(content_layout[key], key);
          } else {
            if (deferreds.length === 0) {
              return defer.resolve(content_pieces);
            } else {
              return $.when.apply($, deferreds).done(function() {
                var content_set_ids;
                content_set_ids = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                _.each(content_set_ids, function(contentSetId, key) {
                  return content_pieces = content_pieces.concat(contentSetId);
                });
                console.log("getContentPiecesFromContentLayout done");
                return defer.resolve(content_pieces);
              });
            }
          }
        };
        forEach(content_layout[0], 0);
      }
      return defer.promise();
    },
    generateSetItems: function(content, content_pieces) {
      var complete_ids, defer, level1, level2, level3, term_ids;
      term_ids = content.data.terms_id;
      level1 = parseInt(content.data.lvl1);
      level2 = parseInt(content.data.lvl2);
      level3 = parseInt(content.data.lvl3);
      complete_ids = [];
      defer = $.Deferred();
      _.getIdFromPostMeta().then(function(postIds) {
        return _.getUniqueIdFromPostMeta(term_ids, postIds, content_pieces).then(function(uniquePostId) {
          uniquePostId = uniquePostId.join();
          return _.checkForEachContentSetValue(uniquePostId, level1, '1').then(function(complete_ids_level1) {
            complete_ids = complete_ids.concat(complete_ids_level1);
            return _.checkForEachContentSetValue(uniquePostId, level2, '2').then(function(complete_ids_level2) {
              complete_ids = complete_ids.concat(complete_ids_level2);
              return _.checkForEachContentSetValue(uniquePostId, level3, '3').then(function(complete_ids_level3) {
                complete_ids = complete_ids.concat(complete_ids_level3);
                return defer.resolve(complete_ids);
              });
            });
          });
        });
      });
      return defer.promise();
    },
    getIdFromPostMeta: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, postId;
        postId = [];
        if (data.rows.length === 0) {
          return defer.resolve(postId);
        } else {
          forEach = function(row, i) {
            postId.push(data.rows.item(i)['ID']);
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              console.log("getIdFromPostMeta done");
              return defer.resolve(postId);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT ID FROM wp_posts WHERE ID IN (SELECT post_id FROM wp_postmeta WHERE meta_key='content_type' AND meta_value='student_question') AND post_status = 'publish' ", [], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getUniqueIdFromPostMeta: function(term_ids, postIds, content_pieces) {
      var defer, difference, onSuccess, term_id;
      defer = $.Deferred();
      difference = _.difference(postIds, content_pieces);
      difference = difference.join();
      term_id = '';
      _.each(term_ids, function(val) {
        if (val !== "") {
          return term_id = val;
        }
      });
      onSuccess = function(tx, data) {
        var forEach, uniquePostId;
        uniquePostId = [];
        if (data.rows.length === 0) {
          return defer.resolve(uniquePostId);
        } else {
          forEach = function(row, i) {
            uniquePostId.push(data.rows.item(i)['post_id']);
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              console.log("getUniqueIdFromPostMeta done");
              return defer.resolve(uniquePostId);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + term_id + '"%';
        return tx.executeSql("SELECT post_id FROM wp_postmeta WHERE post_id IN (" + difference + ") AND meta_key='content_piece_meta' AND meta_value LIKE '%" + pattern + "%' ", [], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    checkForEachContentSetValue: function(uniquePostId, count, level) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var complete_ids_for_each_level, forEach;
        complete_ids_for_each_level = [];
        if (data.rows.length === 0) {
          return defer.resolve(complete_ids_for_each_level);
        } else {
          forEach = function(row, i) {
            complete_ids_for_each_level.push(data.rows.item(i)['post_id']);
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              console.log("getUniqueIdFromPostMeta done");
              return defer.resolve(complete_ids_for_each_level);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT post_id FROM wp_postmeta WHERE post_id in (" + uniquePostId + ") AND meta_key='difficulty_level' AND meta_value = ? ORDER BY RANDOM() LIMIT '" + count + "' ", [level], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getStartDateAndStatus: function(collection_id) {
      var data, defer;
      data = {
        start_date: '',
        status: '',
        attempts: ''
      };
      defer = $.Deferred();
      _.getQuizResponseSummaryByCollectionId(collection_id).then(function(quiz_responses) {
        if (_.isEmpty(quiz_responses)) {
          data.status = 'not started';
          data.start_date = '';
          data.attempts = 0;
          defer.resolve(data);
        }
        if (!_.isEmpty(quiz_responses)) {
          return _.getCollectionMeta(collection_id).then(function(collectionMetaData) {
            var contentLayoutValue, date;
            contentLayoutValue = _.unserialize(quiz_responses.quiz_meta);
            if (collectionMetaData.quizType === 'practice') {
              data.attempts = quiz_responses.attempts;
            }
            if (contentLayoutValue.status === "started") {
              data.status = 'started';
              if (moment(quiz_responses.taken_on).isValid()) {
                data.start_date = quiz_responses.taken_on;
              } else {
                date = quiz_responses.taken_on;
                data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
              }
            } else if (contentLayoutValue.status === "completed") {
              data.status = 'completed';
              if (moment(quiz_responses.taken_on).isValid()) {
                data.start_date = quiz_responses.taken_on;
              } else {
                date = quiz_responses.taken_on;
                data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
              }
            }
            console.log("getStartDateAndStatus done");
            return defer.resolve(data);
          });
        }
      });
      return defer.promise();
    },
    getQuizResponseSummaryByCollectionId: function(collection_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result;
        result = data.rows.item(0);
        if (result.attempts === 0) {
          result = '';
          return defer.resolve(result);
        } else {
          console.log("getQuizResponseSummaryByCollectionId done");
          return defer.resolve(result);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT COUNT(summary_id) AS attempts, taken_on, quiz_meta FROM " + _.getTblPrefix() + "quiz_response_summary WHERE collection_id=? AND student_id=?", [collection_id, _.getUserID()], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getQuizSchedule: function(quiz_id) {
      var defer;
      defer = $.Deferred();
      _.getDivisionIdForSchedule().then(function(division_id_string) {
        var division_id, onSuccess;
        division_id = parseInt(division_id_string);
        onSuccess = function(tx, data) {
          var active, current_date, expired, from, row, schedule, to;
          schedule = new Array();
          row = data.rows.item(0);
          if (row) {
            current_date = _.getCurrentDateTime(0);
            from = row['schedule_from'];
            to = row['schedule_to'];
            if (current_date >= from && current_date <= to) {
              active = true;
            } else {
              active = false;
            }
            if (current_date > to) {
              expired = true;
            } else {
              expired = false;
            }
            schedule = {
              'from': from,
              'to': to,
              'is_active': active,
              'is_expired': expired
            };
            return defer.resolve(schedule);
          } else {
            schedule = '';
            return defer.resolve(schedule);
          }
        };
        return _.db.transaction(function(tx) {
          return tx.executeSql("SELECT schedule_from, schedule_to FROM " + _.getTblPrefix() + "quiz_schedules WHERE quiz_id=? AND division_id=?", [quiz_id, division_id], onSuccess, _.transactionErrorHandler);
        });
      });
      return defer.promise();
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
    },
    getQuizById: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var result, row;
        result = '';
        row = data.rows.item(0);
        return _.getCollectionMeta(row['id']).then(function(collectionMetaData) {
          return _.getStartDateAndStatus(row['id']).then(function(dateStatus) {
            result = {
              id: row['id'],
              content_pieces: collectionMetaData.contentPieces,
              created_by: row['created_by'],
              created_on: row['created_on'],
              duration: row['duration'],
              instructions: collectionMetaData.instructions,
              last_modified_by: row['last_modified_by'],
              last_modified_on: row['last_modified_on'],
              marks: collectionMetaData.marks,
              message: collectionMetaData.message,
              minshours: _.getMinsHours(row['duration']),
              name: row['name'],
              negMarks: collectionMetaData.negMarks,
              negMarksEnable: collectionMetaData.negMarksEnable,
              permissions: collectionMetaData.permission,
              post_status: row['post_status'],
              published_by: row['published_by'],
              published_on: row['published_on'],
              quiz_type: collectionMetaData.quizType,
              status: dateStatus.status,
              attempts: dateStatus.attempts,
              taken_on: dateStatus.start_date,
              term_ids: _.unserialize(row['term_ids']),
              total_minutes: row['duration'],
              type: row['type']
            };
            console.log("getQuizById done");
            return defer.resolve(result);
          });
        });
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_content_collection WHERE id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});

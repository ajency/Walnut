var __slice = [].slice;

define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getQuizByTextbookId: function(textbookId) {
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
            var collectionMeta;
            collectionMeta = _.getCollectionMeta(row['id']);
            return collectionMeta.done(function(collectionMetaData) {
              return (function(row, i, collectionMetaData) {
                var dateAndStatus;
                dateAndStatus = _.getStartDateAndStatus(row['id']);
                return dateAndStatus.done(function(dateStatus) {
                  var attempts, date, status;
                  status = dateStatus.status;
                  attempts = dateStatus.attempts;
                  date = dateStatus.start_date;
                  console.log(JSON.stringify(dateStatus));
                  return result[i] = {
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
                    marks: collectionMetaData.marks,
                    negMarksEnable: collectionMetaData.negMarksEnable,
                    negMarks: collectionMetaData.negMarks,
                    message: collectionMetaData.message,
                    content_layout: "",
                    taken_on: date,
                    status: status,
                    attempts: attempts,
                    content_pieces: collectionMetaData.contentPieces
                  };
                });
              })(row, i, collectionMetaData);
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
        return console.log('getQuizByTextbookId transaction completed');
      }).fail(_.failureHandler);
    },
    getCollectionMeta: function(collection_id) {
      var deferreds, onSuccess, result, runQuery;
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
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, row, _fn, _i, _ref;
          _fn = function(row) {
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
              return deferreds.push(def);
            }
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row);
          }
          if (deferreds.length === 0) {
            return d.resolve(result);
          } else {
            return $.when.apply($, deferreds).done(function() {
              var content_pieces;
              content_pieces = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              _.each(content_pieces, function(contentPiece) {
                return result.contentPieces = contentPiece;
              });
              return d.resolve(result);
            });
          }
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getCollectionMeta transaction completed');
      }).fail(_.failureHandler);
    },
    getContentPiecesFromContentLayout: function(contentLayout) {
      var content_layout, content_pieces, deferreds, runFunc;
      content_pieces = [];
      content_layout = _.unserialize(contentLayout);
      deferreds = [];
      runFunc = function() {
        return $.Deferred(function(d) {
          _.each(content_layout, function(content, key) {
            return (function(content, content_pieces) {
              var def;
              if (content.type === "content-piece") {
                if (content.id) {
                  return content_pieces.push(parseInt(content.id));
                }
              } else if (content.type === "content_set") {
                def = _.generateSetItems(content, content_pieces);
                return deferreds.push(def);
              }
            })(content, content_pieces);
          });
          if (deferreds.length === 0) {
            return d.resolve(content_pieces);
          } else {
            return $.when.apply($, deferreds).done(function() {
              var content_set_ids;
              content_set_ids = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              _.each(content_set_ids, function(contentSetId, key) {
                return content_pieces = content_pieces.concat(contentSetId);
              });
              return d.resolve(content_pieces);
            });
          }
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log("getContentPiecesFromContentLayout done");
      }).fail(_.failureHandler);
    },
    generateSetItems: function(content, content_pieces) {
      var complete_ids, level1, level2, level3, runFunc, term_ids;
      term_ids = content.data.terms_id;
      level1 = parseInt(content.data.lvl1);
      level2 = parseInt(content.data.lvl2);
      level3 = parseInt(content.data.lvl3);
      complete_ids = [];
      runFunc = function() {
        return $.Deferred(function(d) {
          var getPostId;
          getPostId = _.getIdFromPostMeta();
          return getPostId.done(function(postIds) {
            var getUniquePostId;
            getUniquePostId = _.getUniqueIdFromPostMeta(term_ids, postIds, content_pieces);
            return getUniquePostId.done(function(uniquePostId) {
              var getIdFromLevel1;
              uniquePostId = uniquePostId.join();
              getIdFromLevel1 = _.checkForEachContentSetValue(uniquePostId, level1, '1');
              return getIdFromLevel1.done(function(complete_ids_level1) {
                var getIdFromLevel2;
                complete_ids = complete_ids.concat(complete_ids_level1);
                getIdFromLevel2 = _.checkForEachContentSetValue(uniquePostId, level2, '2');
                return getIdFromLevel2.done(function(complete_ids_level2) {
                  var getIdFromLevel3;
                  complete_ids = complete_ids.concat(complete_ids_level2);
                  getIdFromLevel3 = _.checkForEachContentSetValue(uniquePostId, level3, '3');
                  return getIdFromLevel3.done(function(complete_ids_level3) {
                    complete_ids = complete_ids.concat(complete_ids_level3);
                    return d.resolve(complete_ids);
                  });
                });
              });
            });
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('generateSetItems done');
      }).fail(_.failureHandler);
    },
    getIdFromPostMeta: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT ID FROM wp_posts WHERE ID IN (SELECT post_id FROM wp_postmeta WHERE meta_key='content_type' AND meta_value='student_question') AND post_status = 'publish' ", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        var postId;
        postId = [];
        return function(tx, data) {
          var i, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            postId.push(data.rows.item(i)['ID']);
          }
          return d.resolve(postId);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log("getIdFromPostMeta transaction completed");
      }).fail(_.failureHandler);
    },
    getUniqueIdFromPostMeta: function(term_ids, postIds, content_pieces) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          var difference, term_id;
          difference = _.difference(postIds, content_pieces);
          difference = difference.join();
          term_id = '';
          _.each(term_ids, function(val) {
            if (val !== "") {
              return term_id = val;
            }
          });
          return _.db.transaction(function(tx) {
            var pattern;
            pattern = '%"' + term_id + '"%';
            return tx.executeSql("SELECT post_id FROM wp_postmeta WHERE post_id IN (" + difference + ") AND meta_key='content_piece_meta' AND meta_value LIKE '%" + pattern + "%' ", [], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        var uniquePostId;
        uniquePostId = [];
        return function(tx, data) {
          var i, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            uniquePostId.push(data.rows.item(i)['post_id']);
          }
          return d.resolve(uniquePostId);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log("getUniqueIdFromPostMeta transaction completed");
      }).fail(_.failureHandler);
    },
    checkForEachContentSetValue: function(uniquePostId, count, level) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT post_id FROM wp_postmeta WHERE post_id in (" + uniquePostId + ") AND meta_key='difficulty_level' AND meta_value = ? ORDER BY RANDOM() LIMIT '" + count + "' ", [level], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        var complete_ids_for_each_level;
        complete_ids_for_each_level = [];
        return function(tx, data) {
          var i, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            complete_ids_for_each_level.push(data.rows.item(i)['post_id']);
          }
          return d.resolve(complete_ids_for_each_level);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log("checkForEachContentSetValue transaction completed");
      }).fail(_.failureHandler);
    },
    getStartDateAndStatus: function(collection_id) {
      var data, runFunc;
      data = {
        start_date: '',
        status: '',
        attempts: ''
      };
      runFunc = function() {
        return $.Deferred(function(d) {
          var quizResponseSummary;
          quizResponseSummary = _.getQuizResponseSummaryByCollectionId(collection_id);
          return quizResponseSummary.done(function(quiz_responses) {
            var contentLayoutValue, date;
            console.log(JSON.stringify(quiz_responses));
            if (_.isEmpty(quiz_responses)) {
              data.status = 'not started';
              data.start_date = '';
              data.attempts = 0;
            }
            if (!_.isEmpty(quiz_responses)) {
              contentLayoutValue = _.unserialize(quiz_responses.quiz_meta);
              if (contentLayoutValue.attempts) {
                data.attempts = contentLayoutValue.attempts;
                if (moment(quiz_responses.taken_on).isValid()) {
                  data.start_date = quiz_responses.taken_on;
                } else {
                  date = quiz_responses.taken_on;
                  data.start_date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
                }
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
            }
            return d.resolve(data);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getStartDateAndStatus done');
      }).fail(_.failureHandler);
    },
    getQuizResponseSummaryByCollectionId: function(collection_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(summary_id) AS attempts, taken_on, quiz_meta FROM " + _.getTblPrefix() + "quiz_response_summary WHERE collection_id=? AND student_id=?", [collection_id, _.getUserID()], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result;
          result = data.rows.item(0);
          if (result.attempts === 0) {
            result = '';
            return d.resolve(result);
          } else {
            return d.resolve(result);
          }
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizResponseSummaryByCollectionId transaction completed');
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
    },
    getQuizById: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_content_collection WHERE id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var result, row;
          result = '';
          row = data.rows.item(0);
          return (function(row) {
            var collectionMeta;
            collectionMeta = _.getCollectionMeta(row['id']);
            return collectionMeta.done(function(collectionMetaData) {
              return (function(row, collectionMetaData) {
                var dateAndStatus;
                dateAndStatus = _.getStartDateAndStatus(row['id']);
                return dateAndStatus.done(function(dateStatus) {
                  console.log(JSON.stringify(dateStatus.status));
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
                  return d.resolve(result);
                });
              })(row, collectionMetaData);
            });
          })(row);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuizById done');
      }).fail(_.failureHandler);
    }
  });
});

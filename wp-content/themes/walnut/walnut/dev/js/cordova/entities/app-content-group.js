define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    cordovaContentGroupCollection: function(textbookId, division) {
      var defer, result;
      defer = $.Deferred();
      result = [];
      _.getContentGroupByTextbookId(textbookId).then(function(contentGroupData) {
        var forEach, length;
        console.log('getContentGroupByTextbookId done');
        length = contentGroupData.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getContentPiecesAndDescription(row['id']).then(function(contPiecesNDesc) {
              var contentPieces, description;
              console.log('getContentPiecesAndDescription done');
              contentPieces = _.unserialize(contPiecesNDesc.content_pieces);
              description = _.unserialize(contPiecesNDesc.description);
              return _.getDateAndStatus(row['id'], division, contentPieces).then(function(dateNStatus) {
                var data, date, status;
                console.log('getDateAndStatus done');
                status = dateNStatus.status;
                date = dateNStatus.start_date;
                if (!(row['status'] === 'archive' && status === 'not started')) {
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
                    term_ids: unserialize(row['term_ids']),
                    duration: _.getDuration(row['duration']),
                    minshours: _.getMinsHours(row['duration']),
                    total_minutes: row['duration'],
                    status: status,
                    training_date: date,
                    content_pieces: contentPieces,
                    description: description,
                    post_status: row['status']
                  };
                  result.push(data);
                }
                i = i + 1;
                if (i < length) {
                  return forEach(contentGroupData.rows.item(i), i);
                } else {
                  return defer.resolve(result);
                }
              });
            });
          };
          return forEach(contentGroupData.rows.item(0), 0);
        }
      });
      return defer.promise();
    },
    getContentGroupByTextbookId: function(textbookId) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        return defer.resolve(data);
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%"' + textbookId + '"%';
        return tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "' AND status IN ('publish', 'archive') AND type=?", ['teaching-module'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getContentGroupById: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var row;
        row = data.rows.item(0);
        return _.getContentPiecesAndDescription(row['id']).then(function(contPiecesNDesc) {
          var contentPieces, description, result;
          console.log('getContentPiecesAndDescription done');
          contentPieces = _.unserialize(contPiecesNDesc.content_pieces);
          description = _.unserialize(contPiecesNDesc.description);
          result = {
            id: row['id'],
            name: row['name'],
            created_on: row['created_on'],
            created_by: row['created_by'],
            last_modified_on: row['last_modified_on'],
            last_modified_by: row['last_modified_by'],
            published_on: row['published_on'],
            published_by: row['published_by'],
            type: row['type'],
            term_ids: unserialize(row['term_ids']),
            duration: _.getDuration(row['duration']),
            minshours: _.getMinsHours(row['duration']),
            total_minutes: row['duration'],
            status: row['status'],
            content_pieces: contentPieces,
            description: description
          };
          return defer.resolve(result);
        });
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_content_collection WHERE id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getContentPiecesAndDescription: function(collection_id) {
      var contentPiecesAndDescription, defer, onSuccess;
      defer = $.Deferred();
      contentPiecesAndDescription = {
        content_pieces: '',
        description: ''
      };
      onSuccess = function(tx, data) {
        var forEach, length;
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(contentPiecesAndDescription);
        } else {
          forEach = function(row, i) {
            if (row['meta_key'] === 'description') {
              contentPiecesAndDescription.description = row['meta_value'];
            }
            if (row['meta_key'] === 'content_pieces') {
              contentPiecesAndDescription.content_pieces = row['meta_value'];
            }
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(contentPiecesAndDescription);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getDateAndStatus: function(collection_id, division, content_pieces) {
      var data, defer;
      defer = $.Deferred();
      data = {
        start_date: '',
        status: ''
      };
      _.getModuleResponses(collection_id, division).then(function(module_responses) {
        var response_content_ids;
        console.log('getModuleResponses done');
        if (_.isEmpty(module_responses)) {
          data.status = 'not started';
        }
        if (!_.isEmpty(module_responses)) {
          if (_.first(module_responses).status === 'scheduled') {
            data.status = 'scheduled';
          } else {
            data.status = 'started';
          }
          data.start_date = _.last(module_responses).start_date;
          response_content_ids = [];
          _.each(module_responses, function(response, key) {
            if (response.status === 'completed') {
              return response_content_ids[key] = response.content_piece_id;
            }
          });
          if ((content_pieces.length - response_content_ids.length) === 0) {
            data.status = 'completed';
          }
        }
        return defer.resolve(data);
      });
      return defer.promise();
    },
    getModuleResponses: function(collection_id, division) {
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
            result[i] = row;
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
        return tx.executeSql("SELECT content_piece_id, status, start_date FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess, _.transactionErrorHandler);
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
    }
  });
});

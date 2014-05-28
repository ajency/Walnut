define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getContentPiecesAndDescription: function(collection_id) {
      var contentPiecesAndDescription, onSuccess, runQuery;
      contentPiecesAndDescription = {
        content_pieces: '',
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
            if (row['meta_key'] === 'description') {
              contentPiecesAndDescription.description = row['meta_value'];
            }
            if (row['meta_key'] === 'content_pieces') {
              contentPiecesAndDescription.content_pieces = row['meta_value'];
            }
          }
          return d.resolve(contentPiecesAndDescription);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getContentPiecesAndDescription transaction completed');
      }).fail(_.failureHandler);
    },
    getLastDetails: function(collection_id, division) {
      var lastDetails, onSuccess, runQuery;
      lastDetails = {
        id: '',
        date: '',
        status: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT id, status, date FROM " + _.getTblPrefix() + "training_logs WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var row;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            lastDetails = {
              id: row['id'],
              date: row['date'],
              status: row['status']
            };
          }
          return d.resolve(lastDetails);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastDetails transaction completed');
      }).fail(_.failureHandler);
    },
    getDataFromQuestionResponse: function(collection_id, division) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT content_piece_id, status FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, _i, _ref;
          result = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            result[i] = data.rows.item(i);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDataFromQuestionResponse transaction completed');
      }).fail(_.failureHandler);
    },
    getDateAndStatus: function(collection_id, division, content_pieces) {
      var runGetDateAndStatus;
      runGetDateAndStatus = function() {
        return $.Deferred(function(d) {
          var data, dateAndStatus;
          data = {
            date: '',
            status: ''
          };
          dateAndStatus = _.getLastDetails(collection_id, division);
          return dateAndStatus.done(function(lastDetails) {
            var quesResponse;
            if (lastDetails.id !== '') {
              data['date'] = lastDetails.date;
              data['status'] = 'scheduled';
            }
            quesResponse = _.getDataFromQuestionResponse(collection_id, division);
            return quesResponse.done(function(quesRes) {
              var response_content_ids;
              if (quesRes.length !== 0) {
                data['status'] = 'started';
              }
              response_content_ids = [];
              _.each(quesRes, function(response, key) {
                if (response.status === 'completed') {
                  return response_content_ids[key] = response.content_piece_id;
                }
              });
              if ((content_pieces.length - response_content_ids.length) === 0) {
                data['status'] = 'completed';
              }
              return d.resolve(data);
            });
          });
        });
      };
      return $.when(runGetDateAndStatus()).done(function() {
        return console.log('getDateAndStatus done');
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

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
    getModuleResponses: function(collection_id, division) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT content_piece_id, status, start_date FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
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
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var data, module_responses;
          data = {
            start_date: '',
            status: ''
          };
          module_responses = _.getModuleResponses(collection_id, division);
          return module_responses.done(function(module_responses) {
            var response_content_ids;
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
            return d.resolve(data);
          });
        });
      };
      return $.when(runFunc()).done(function() {
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

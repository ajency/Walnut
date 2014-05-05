var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'unserialize', 'serialize'], function(App, Backbone) {
  return App.module("Entities.QuestionResponse", function(QuestionResponse, App, Backbone, Marionette, $, _) {
    var API, QuestionResponseCollection, QuestionResponseModel;
    QuestionResponseModel = (function(_super) {
      __extends(QuestionResponseModel, _super);

      function QuestionResponseModel() {
        return QuestionResponseModel.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseModel.prototype.defaults = {
        collection_id: 0,
        content_piece_id: 0,
        date_created: '',
        date_modified: '',
        total_time: 0,
        question_response: [],
        time_started: '',
        time_completed: ''
      };

      QuestionResponseModel.prototype.name = 'question-response';

      return QuestionResponseModel;

    })(Backbone.Model);
    QuestionResponseCollection = (function(_super) {
      __extends(QuestionResponseCollection, _super);

      function QuestionResponseCollection() {
        return QuestionResponseCollection.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseCollection.prototype.model = QuestionResponseModel;

      QuestionResponseCollection.prototype.comparator = 'term_order';

      QuestionResponseCollection.prototype.name = 'question-response';

      QuestionResponseCollection.prototype.url = function() {
        return AJAXURL + '?action=get-question-response';
      };

      QuestionResponseCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return QuestionResponseCollection;

    })(Backbone.Collection);
    API = {
      getAllQuestionResponses: function(param) {
        var responseCollection;
        if (param == null) {
          param = {};
        }
        responseCollection = new QuestionResponseCollection;
        responseCollection.fetch({
          reset: true,
          data: param
        });
        return responseCollection;
      },
      saveQuestionResponse: function(data) {
        var questionResponse;
        questionResponse = new QuestionResponseModel(data);
        return questionResponse;
      },
      getQuestionResponseFromLocal: function(collection_id, division) {
        var deferredErrorHandler, failureHandler, getQuestionType, onSuccess, runMainQuery;
        getQuestionType = function(content_piece_id) {
          var runQ, success;
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT meta_value FROM wp_postmeta WHERE post_id=? AND meta_key='question_type'", [content_piece_id], success(d), deferredErrorHandler(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              var meta_value;
              meta_value = data.rows.item(0)['meta_value'];
              return d.resolve(meta_value);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getQuestionType transaction completed');
          }).fail(failureHandler);
        };
        runMainQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, r, result;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              r = data.rows.item(i);
              (function(r, i) {
                var questionType;
                questionType = getQuestionType(r['content_piece_id']);
                return questionType.done(function(question_type) {
                  var q_resp;
                  if (question_type === 'individual') {
                    q_resp = unserialize(r['question_response']);
                  } else {
                    q_resp = r['question_response'];
                  }
                  return result[i] = {
                    id: r['id'],
                    content_piece_id: r['content_piece_id'],
                    collection_id: r['collection_id'],
                    division: r['division'],
                    date_created: r['date_created'],
                    date_modified: r['date_modified'],
                    total_time: r['total_time'],
                    question_response: q_resp,
                    time_started: r['time_started'],
                    time_completed: r['time_completed']
                  };
                });
              })(r, i);
              i++;
            }
            return d.resolve(result);
          };
        };
        deferredErrorHandler = function(d) {
          return function(tx, error) {
            return d.reject(error);
          };
        };
        failureHandler = function(error) {
          return console.log('ERROR: ' + error.message);
        };
        return $.when(runMainQuery()).done(function(data) {
          return console.log('getQuestionResponseFromLocal transaction completed');
        }).fail(failureHandler);
      },
      saveQuestionResponseLocal: function(p) {
        var insertData, insertQuestionResponse, updateData, updateQuestionResponse;
        insertQuestionResponse = function(data) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("INSERT INTO wp_question_response (content_piece_id, collection_id, division, date_created, date_modified, total_time, question_response, time_started, time_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.content_piece_id, data.collection_id, data.division, data.date_created, data.date_modified, data.total_time, data.question_response, data.time_started, data.time_completed]);
          }, function(tx, error) {
            return console.log('ERROR: ' + error.message);
          }, function(tx) {
            return console.log('Success: Inserted new record in wp_question_response');
          });
        };
        updateQuestionResponse = function(data) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("UPDATE wp_question_response SET date_modified=?, question_response=? WHERE id=?", [data.date_modified, data.question_response, data.id]);
          }, function(tx, error) {
            return console.log('ERROR: ' + error.message);
          }, function(tx) {
            return console.log('Success: Updated record in wp_question_response');
          });
        };
        if (typeof p.id === 'undefined') {
          insertData = {
            collection_id: p.collection_id,
            content_piece_id: p.content_piece_id,
            division: p.division,
            date_created: _.getCurrentDate(),
            date_modified: _.getCurrentDate(),
            total_time: 0,
            question_response: serialize(p.question_response),
            time_started: '',
            time_completed: ''
          };
          return insertQuestionResponse(insertData);
        } else {
          updateData = {
            id: p.id,
            date_modified: _.getCurrentDate(),
            question_response: serialize(p.question_response)
          };
          return updateQuestionResponse(updateData);
        }
      }
    };
    App.reqres.setHandler("get:question:response:collection", function(params) {
      return API.getAllQuestionResponses(params);
    });
    App.reqres.setHandler("save:question:response", function(qID) {
      return API.saveQuestionResponse(qID);
    });
    App.reqres.setHandler("get:question-response:local", function(collection_id, division) {
      return API.getQuestionResponseFromLocal(collection_id, division);
    });
    return App.reqres.setHandler("save:question-response:local", function(params) {
      return API.saveQuestionResponseLocal(params);
    });
  });
});

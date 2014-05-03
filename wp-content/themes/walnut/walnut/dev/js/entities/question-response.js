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
        var onFailure, onSuccess, question_type, runQuery;
        question_type = 'individual';
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, q_resp, result, row;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              row = data.rows.item(i);
              q_resp = '';
              if (question_type === 'individual') {
                q_resp = unserialize(row['question_response']);
              }
              result[i] = {
                id: row['id'],
                content_piece_id: row['content_piece_id'],
                collection_id: row['collection_id'],
                division: row['division'],
                date_created: row['date_created'],
                date_modified: row['date_modified'],
                total_time: row['total_time'],
                question_response: q_resp,
                time_started: row['time_started'],
                time_completed: row['time_completed']
              };
              i++;
            }
            return d.resolve(result);
          };
        };
        onFailure = function(d) {
          return function(tx, error) {
            return d.reject(error);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getQuestionResponseFromLocal transaction completed');
        }).fail(function(error) {
          return console.log('ERROR: ' + error.message);
        });
      },
      saveQuestionResponseLocal: function(p) {
        var insertData, insertQuestionResponse, updateQuestionResponse;
        insertQuestionResponse = function(data) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("INSERT INTO wp_question_response (content_piece_id, collection_id, division, date_created, date_modified, total_time, question_response, time_started, time_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.content_piece_id, data.collection_id, data.division, data.date_created, data.date_modified, data.total_time, data.question_response, data.time_started, data.time_completed]);
          }, function(tx, error) {
            return console.log('ERROR: ' + error.message);
          }, function(tx) {
            return console.log('Success: Inserted new record in wp_question_response');
          });
        };
        updateQuestionResponse = function() {
          return _.db.transaction(function(tx) {
            return tx.executeSql("UPDATE wp_question_response SET status=? WHERE id=?", [status, id]);
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
          return console.log('ID: ' + p.id);
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

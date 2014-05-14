var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'serialize'], function(App, Backbone) {
  return App.module("Entities.QuestionResponse", function(QuestionResponse, App, Backbone, Marionette, $, _) {
    var API, QuestionResponseCollection, QuestionResponseModel;
    QuestionResponseModel = (function(_super) {
      __extends(QuestionResponseModel, _super);

      function QuestionResponseModel() {
        return QuestionResponseModel.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseModel.prototype.idAttribute = 'ref_id';

      QuestionResponseModel.prototype.defaults = {
        collection_id: 0,
        content_piece_id: '',
        division: 0,
        question_response: [],
        time_taken: 0,
        start_date: '',
        end_date: '',
        status: ''
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
      updateQuestionResponseLogs: function(refID) {
        var connection_resp, options;
        options = {
          url: AJAXURL + '?action=update-question-response-logs',
          data: refID,
          success: (function(_this) {
            return function(response) {
              if (response.error) {
                return console.log('some error occured while saving question logs for refID: ' + refID);
              }
            };
          })(this)
        };
        connection_resp = App.request("get:auth:controller", options);
        if (_.checkPlatform() === 'Desktop') {
          return connection_resp.authenticate();
        } else {
          return _.updateQuestionResponseLogs(refID);
        }
      },
      getQuestionResponseFromLocal: function(collection_id, division) {
        var onSuccess, runMainQuery;
        runMainQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
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
                questionType = _.getQuestionType(r['content_piece_id']);
                return questionType.done(function(question_type) {
                  var q_resp;
                  if (question_type === 'individual') {
                    q_resp = unserialize(r['question_response']);
                  } else {
                    q_resp = r['question_response'];
                  }
                  return result[i] = {
                    ref_id: r['ref_id'],
                    content_piece_id: r['content_piece_id'],
                    collection_id: r['collection_id'],
                    division: r['division'],
                    question_response: q_resp,
                    time_taken: r['time_taken'],
                    start_date: r['start_date'],
                    end_date: r['end_date'],
                    status: r['status']
                  };
                });
              })(r, i);
              i++;
            }
            return d.resolve(result);
          };
        };
        return $.when(runMainQuery()).done(function(data) {
          return console.log('getQuestionResponseFromLocal transaction completed');
        }).fail(_.failureHandler);
      },
      saveUpdateQuestionResponseLocal: function(model) {
        var insert_question_response, update_question_response;
        console.log('saveUpdateQuestionResponseLocal');
        insert_question_response = function() {
          var ref_id;
          ref_id = 'CP' + model.get('content_piece_id') + 'C' + model.get('collection_id') + 'D' + model.get('division');
          _.db.transaction(function(tx) {
            return tx.executeSql('INSERT INTO wp_question_response (ref_id, content_piece_id, collection_id, division, question_response, time_taken, start_date, end_date, status) VALUES (?,?,?,?,?,?,?,?,?)', [ref_id, model.get('content_piece_id'), model.get('collection_id'), model.get('division'), model.get('question_response'), model.get('time_taken'), model.get('start_date'), model.get('end_date'), 'started']);
          }, _.transactionErrorHandler, function(tx) {
            return console.log('SUCCESS: Inserted record in wp_question_response');
          });
          _.updateQuestionResponseLogs(ref_id);
          return model.set({
            'ref_id': ref_id
          });
        };
        update_question_response = function() {
          var questionType;
          questionType = _.getQuestionType(model.get('content_piece_id'));
          return questionType.done(function(question_type) {
            var q_resp, status;
            if (question_type === 'individual') {
              q_resp = serialize(model.get('question_response'));
            } else {
              q_resp = model.get('question_response');
            }
            status = model.get('status');
            if ((model.get('status')) !== 'paused') {
              status = 'completed';
            }
            return _.db.transaction(function(tx) {
              return tx.executeSql('UPDATE wp_question_response SET question_response=?, time_taken=?, status=? WHERE ref_id=?', [q_resp, model.get('time_taken'), status, model.get('ref_id')]);
            }, _.transactionErrorHandler, function(tx) {
              return console.log('SUCCESS: Updated record in wp_question_response');
            });
          });
        };
        if (model.has('ref_id')) {
          return update_question_response();
        } else {
          return insert_question_response();
        }
      }
    };
    App.reqres.setHandler("get:question:response:collection", function(params) {
      return API.getAllQuestionResponses(params);
    });
    App.reqres.setHandler("save:question:response", function(qID) {
      return API.saveQuestionResponse(qID);
    });
    App.reqres.setHandler("update:question:response:logs", function(refID) {
      return API.updateQuestionResponseLogs(refID);
    });
    App.reqres.setHandler("get:question-response:local", function(collection_id, division) {
      return API.getQuestionResponseFromLocal(collection_id, division);
    });
    return App.reqres.setHandler("save:question-response:local", function(model) {
      return API.saveUpdateQuestionResponseLocal(model);
    });
  });
});

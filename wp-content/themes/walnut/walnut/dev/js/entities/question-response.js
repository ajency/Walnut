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

      QuestionResponseModel.prototype.idAttribute = 'ref_id';

      QuestionResponseModel.prototype.defaults = {
        collection_id: 0,
        content_piece_id: 0,
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
      getQuestionResponseFromLocal: function(collection_id, division) {
        var onSuccess, runMainQuery;
        runMainQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, r, result, _fn, _i, _ref;
            result = [];
            _fn = function(r, i) {
              var questionType;
              console.log('content_piece_id: ' + content_piece_id);
              questionType = _.getMetaValue(r['content_piece_id']);
              return questionType.done(function(meta_value) {
                var q_resp;
                if (meta_value.question_type === 'individual') {
                  q_resp = unserialize(r['question_response']);
                } else {
                  q_resp = r['question_response'];
                }
                return result[i] = {
                  ref_id: r['ref_id'],
                  teacher_id: r['teacher_id'],
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
            };
            for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
              r = data.rows.item(i);
              _fn(r, i);
            }
            return d.resolve(result);
          };
        };
        return $.when(runMainQuery()).done(function(data) {
          return console.log('getQuestionResponseFromLocal transaction completed');
        }).fail(_.failureHandler);
      },
      saveUpdateQuestionResponseLocal: function(model) {
        return _.saveUpdateQuestionResponse(model);
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
    return App.reqres.setHandler("save:question-response:local", function(model) {
      return API.saveUpdateQuestionResponseLocal(model);
    });
  });
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
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
        total_time: 0,
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
        var connection_resp;
        return connection_resp = $.middle_layer(AJAXURL + '?action=update-question-response-logs', {
          ref_id: refID
        }, (function(_this) {
          return function(response) {
            if (response.error) {
              return console.log('some error occured while saving question logs for refID: ' + refID);
            }
          };
        })(this));
      }
    };
    App.reqres.setHandler("get:question:response:collection", function(params) {
      return API.getAllQuestionResponses(params);
    });
    App.reqres.setHandler("save:question:response", function(qID) {
      return API.saveQuestionResponse(qID);
    });
    return App.reqres.setHandler("update:question:response:logs", function(refID) {
      return API.updateQuestionResponseLogs(refID);
    });
  });
});

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuestionResponse", function(QuestionResponse, App, Backbone, Marionette, $, _) {
    var API, QuestionResponseCollection, QuestionResponseModel;
    QuestionResponseModel = (function(superClass) {
      extend(QuestionResponseModel, superClass);

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
    QuestionResponseCollection = (function(superClass) {
      extend(QuestionResponseCollection, superClass);

      function QuestionResponseCollection() {
        return QuestionResponseCollection.__super__.constructor.apply(this, arguments);
      }

      QuestionResponseCollection.prototype.model = QuestionResponseModel;

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
      getEmptyQuestionResponseCollection: function() {
        var responseCollection;
        return responseCollection = new QuestionResponseCollection;
      }
    };
    App.reqres.setHandler("get:question:response:collection", function(params) {
      return API.getAllQuestionResponses(params);
    });
    App.reqres.setHandler("get:empty:question:response:collection", function() {
      return API.getEmptyQuestionResponseCollection();
    });
    return App.reqres.setHandler("save:question:response", function(qID) {
      return API.saveQuestionResponse(qID);
    });
  });
});

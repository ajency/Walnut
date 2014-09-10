var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuizQuestionResponse", function(QuizQuestionResponse, App, Backbone, Marionette, $, _) {
    var API;
    QuizQuestionResponse.ResponseModel = (function(_super) {
      __extends(ResponseModel, _super);

      function ResponseModel() {
        return ResponseModel.__super__.constructor.apply(this, arguments);
      }

      ResponseModel.prototype.idAttribute = 'qr_id';

      ResponseModel.prototype.defaults = {
        summary_id: '',
        content_piece_id: 0,
        question_response: [],
        time_taken: 0,
        marks_scored: 0,
        status: ''
      };

      ResponseModel.prototype.name = 'quiz-question-response';

      return ResponseModel;

    })(Backbone.Model);
    QuizQuestionResponse.ResponseCollection = (function(_super) {
      __extends(ResponseCollection, _super);

      function ResponseCollection() {
        return ResponseCollection.__super__.constructor.apply(this, arguments);
      }

      ResponseCollection.prototype.model = QuizQuestionResponse.ResponseModel;

      ResponseCollection.prototype.name = 'quiz-question-response';

      ResponseCollection.prototype.url = function() {
        return AJAXURL + '?action=get-all-quiz-question-responses';
      };

      ResponseCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ResponseCollection;

    })(Backbone.Collection);
    API = {
      createQuizQuestionResponseModel: function(data) {
        var quizResponseModel;
        if (data == null) {
          data = {};
        }
        quizResponseModel = new QuizQuestionResponse.ResponseModel;
        quizResponseModel.set(data);
        return quizResponseModel;
      },
      createEmptyQuizQuestionResponseCollection: function(data) {
        var responseCollection;
        if (data == null) {
          data = {};
        }
        responseCollection = new QuizQuestionResponse.ResponseCollection;
        return responseCollection;
      },
      getAllQuizQuestionResponses: function(param) {
        var responseCollection;
        if (param == null) {
          param = {};
        }
        responseCollection = new QuizQuestionResponse.ResponseCollection;
        responseCollection.fetch({
          reset: true,
          data: param
        });
        return responseCollection;
      }
    };
    App.reqres.setHandler("create:quiz:question:response:model", function(data) {
      return API.createQuizQuestionResponseModel(data);
    });
    App.reqres.setHandler("create:empty:question:response:collection", function(data) {
      return API.createEmptyQuizQuestionResponseCollection(data);
    });
    return App.reqres.setHandler("get:quiz:question:response:collection", function(params) {
      return API.getAllQuizQuestionResponses(params);
    });
  });
});

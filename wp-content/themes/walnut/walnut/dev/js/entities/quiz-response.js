var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuizResponse", function(QuizResponse, App, Backbone, Marionette, $, _) {
    var API;
    QuizResponse.QuizResponseModel = (function(_super) {
      __extends(QuizResponseModel, _super);

      function QuizResponseModel() {
        return QuizResponseModel.__super__.constructor.apply(this, arguments);
      }

      QuizResponseModel.prototype.idAttribute = 'ref_id';

      QuizResponseModel.prototype.defaults = {
        collection_id: 0,
        content_piece_id: 0,
        user_id: 0,
        question_response: [],
        time_taken: 0,
        start_date: '',
        end_date: '',
        status: ''
      };

      QuizResponseModel.prototype.name = 'quiz-response';

      QuizResponse.QuizResponseCollection = (function(_super1) {
        __extends(QuizResponseCollection, _super1);

        function QuizResponseCollection() {
          return QuizResponseCollection.__super__.constructor.apply(this, arguments);
        }

        QuizResponseCollection.prototype.model = QuizResponse.QuizResponseModel;

        QuizResponseCollection.prototype.url = function() {
          return AJAXURL + '?action=get-quiz-response';
        };

        QuizResponseCollection.prototype.parse = function(resp) {
          this.total = resp.count;
          return resp.data;
        };

        return QuizResponseCollection;

      })(Backbone.Collection);

      return QuizResponseModel;

    })(Backbone.Model);
    API = {
      createQuizResponseModel: function(data) {
        var quizResponseModel;
        if (data == null) {
          data = {};
        }
        quizResponseModel = new QuizResponse.QuizResponseModel;
        quizResponseModel.set(data);
        return quizResponseModel;
      },
      getAllQuizResponses: function(param) {
        var responseCollection;
        if (param == null) {
          param = {};
        }
        responseCollection = new QuizResponse.QuizResponseCollection;
        responseCollection.fetch({
          reset: true,
          data: param
        });
        return responseCollection;
      }
    };
    App.reqres.setHandler("create:quiz:response:model", function(data) {
      return API.createQuizResponseModel(data);
    });
    return App.reqres.setHandler("get:quiz:response:collection", function(params) {
      return API.getAllQuizResponses(params);
    });
  });
});

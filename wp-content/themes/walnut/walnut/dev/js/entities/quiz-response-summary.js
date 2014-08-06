var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuizQuestionResponse", function(QuizResponse, App, Backbone, Marionette, $, _) {
    var API;
    QuizResponseSummary.SummaryModel = (function(_super) {
      __extends(SummaryModel, _super);

      function SummaryModel() {
        return SummaryModel.__super__.constructor.apply(this, arguments);
      }

      SummaryModel.prototype.idAttribute = 'summary_id';

      SummaryModel.prototype.defaults = {
        collection_id: 0,
        user_id: 0,
        total_time_taken: 0,
        marks_scored: 0,
        status: ''
      };

      SummaryModel.prototype.name = 'quiz-response-summary';

      QuizResponseSummary.SummaryCollection = (function(_super1) {
        __extends(SummaryCollection, _super1);

        function SummaryCollection() {
          return SummaryCollection.__super__.constructor.apply(this, arguments);
        }

        SummaryCollection.prototype.model = QuizResponseSummary.SummaryModel;

        SummaryCollection.prototype.url = function() {
          return AJAXURL + '?action=get-all-quiz-response-summary';
        };

        SummaryCollection.prototype.parse = function(resp) {
          this.total = resp.count;
          return resp.data;
        };

        return SummaryCollection;

      })(Backbone.Collection);

      return SummaryModel;

    })(Backbone.Model);
    API = {
      createQuizResponseSummary: function(data) {
        var quizResponseSummary;
        if (data == null) {
          data = {};
        }
        quizResponseSummary = new QuizResponseSummary.SummaryModel;
        quizResponseSummary.set(data);
        return quizResponseSummary;
      }
    };
    return App.reqres.setHandler("create:quiz:response:summary", function(data) {
      return API.createQuizResponseSummaryModel(data);
    });
  });
});

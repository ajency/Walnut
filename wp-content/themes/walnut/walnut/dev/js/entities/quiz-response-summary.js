var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.QuizQuestionResponse", function(QuizResponseSummary, App, Backbone, Marionette, $, _) {
    var API;
    QuizResponseSummary.SummaryModel = (function(superClass) {
      extend(SummaryModel, superClass);

      function SummaryModel() {
        return SummaryModel.__super__.constructor.apply(this, arguments);
      }

      SummaryModel.prototype.idAttribute = 'summary_id';

      SummaryModel.prototype.defaults = {
        collection_id: 0,
        student_id: 0,
        taken_on: '',
        num_skipped: 0,
        total_time_taken: 0,
        total_marks_scored: 0,
        status: ''
      };

      SummaryModel.prototype.name = 'quiz-response-summary';

      return SummaryModel;

    })(Backbone.Model);
    QuizResponseSummary.SummaryCollection = (function(superClass) {
      extend(SummaryCollection, superClass);

      function SummaryCollection() {
        return SummaryCollection.__super__.constructor.apply(this, arguments);
      }

      SummaryCollection.prototype.model = QuizResponseSummary.SummaryModel;

      SummaryCollection.prototype.url = function() {
        return AJAXURL + '?action=get-quiz-response-summary';
      };

      SummaryCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return SummaryCollection;

    })(Backbone.Collection);
    API = {
      createQuizResponseSummary: function(data) {
        var quizResponseSummary;
        if (data == null) {
          data = {};
        }
        if (!data.collection_id && data.student_id) {
          return false;
        }
        quizResponseSummary = new QuizResponseSummary.SummaryModel;
        quizResponseSummary.set(data);
        return quizResponseSummary;
      },
      getQuizResponseSummary: function(param) {
        var QuizResponseSummaryCollection;
        if (param == null) {
          param = {};
        }
        QuizResponseSummaryCollection = new QuizResponseSummary.SummaryCollection;
        QuizResponseSummaryCollection.fetch({
          reset: true,
          data: param
        });
        return QuizResponseSummaryCollection;
      },
      getQuizResponseSummaryByID: function(summary_id) {
        var quizResponseSummary;
        quizResponseSummary = new QuizResponseSummary.SummaryModel({
          summary_id: summary_id
        });
        quizResponseSummary.fetch();
        return quizResponseSummary;
      },
      createQuizResponseSummaryCollection: function(data) {
        var QuizResponseSummaryCollection;
        QuizResponseSummaryCollection = new QuizResponseSummary.SummaryCollection;
        QuizResponseSummaryCollection.set(data);
        return QuizResponseSummaryCollection;
      }
    };
    App.reqres.setHandler("create:quiz:response:summary", function(data) {
      return API.createQuizResponseSummary(data);
    });
    App.reqres.setHandler("get:quiz:response:summary:by:id", function(summary_id) {
      return API.getQuizResponseSummaryByID(summary_id);
    });
    App.reqres.setHandler("get:quiz:response:summary", function(data) {
      return API.getQuizResponseSummary(data);
    });
    return App.reqres.setHandler("create:quiz:response:summary:collection", function(data) {
      return API.createQuizResponseSummaryCollection(data);
    });
  });
});

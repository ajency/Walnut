var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'], function(App, RegionController, quizProgressTemplate) {
  return App.module("TakeQuizApp.QuizProgress", function(QuizProgress, App) {
    var QuestionProgressView, QuizProgressView;
    QuizProgress.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var currentQuestion, view;
        this.questionsCollection = opts.questionsCollection, currentQuestion = opts.currentQuestion, this.questionResponseCollection = opts.questionResponseCollection;
        this.view = view = this._showQuizProgressView(this.questionsCollection, currentQuestion);
        this.show(view, {
          loading: true
        });
        this.listenTo(view, "change:question", function(id) {
          return this.region.trigger("change:question", id);
        });
        this.listenTo(this.region, "question:changed", function(model) {
          return this.view.triggerMethod("question:change", model);
        });
        return this.listenTo(this.region, "question:submitted", function(responseModel) {
          return this.view.triggerMethod("question:submitted", responseModel);
        });
      };

      Controller.prototype._showQuizProgressView = function(collection, currentQuestion) {
        return new QuizProgressView({
          collection: collection,
          currentQuestion: currentQuestion
        });
      };

      return Controller;

    })(RegionController);
    QuestionProgressView = (function(_super) {
      __extends(QuestionProgressView, _super);

      function QuestionProgressView() {
        return QuestionProgressView.__super__.constructor.apply(this, arguments);
      }

      QuestionProgressView.prototype.template = '<a id="{{ID}}">{{itemNumber}}</a>';

      QuestionProgressView.prototype.tagName = 'li';

      QuestionProgressView.prototype.mixinTemplateHelpers = function(data) {
        data.itemNumber = Marionette.getOption(this, 'itemNumber');
        return data;
      };

      return QuestionProgressView;

    })(Marionette.ItemView);
    return QuizProgressView = (function(_super) {
      __extends(QuizProgressView, _super);

      function QuizProgressView() {
        return QuizProgressView.__super__.constructor.apply(this, arguments);
      }

      QuizProgressView.prototype.className = 'quizProgress';

      QuizProgressView.prototype.template = quizProgressTemplate;

      QuizProgressView.prototype.itemView = QuestionProgressView;

      QuizProgressView.prototype.itemViewContainer = '#quiz-items';

      QuizProgressView.prototype.itemViewOptions = function(model, index) {
        return {
          itemNumber: index + 1
        };
      };

      QuizProgressView.prototype.events = {
        'click #quiz-items a': function(e) {
          return this.trigger("change:question", $(e.target).attr('id'));
        }
      };

      QuizProgressView.prototype.mixinTemplateHelpers = function(data) {
        var currentQuestion;
        data.totalQuestions = this.collection.length;
        currentQuestion = Marionette.getOption(this, 'currentQuestion');
        data.answeredQuestions = this.collection.indexOf(currentQuestion.id) + 1;
        data.progressPercentage = (data.answeredQuestions / data.totalQuestions) * 100;
        return data;
      };

      QuizProgressView.prototype.onShow = function() {
        var currentQuestion;
        this.$el.find("div.holder").jPages({
          containerID: "quiz-items",
          perPage: 9,
          keyBrowse: true,
          animation: "fadeIn",
          previous: ".fa-chevron-left",
          next: ".fa-chevron-right",
          midRange: 15,
          links: "blank"
        });
        currentQuestion = Marionette.getOption(this, 'currentQuestion');
        return this.$el.find("#quiz-items a#" + currentQuestion.id).closest('li').addClass('current');
      };

      QuizProgressView.prototype.onQuestionChange = function(model) {
        this.$el.find("#quiz-items li").removeClass('current');
        return this.$el.find("#quiz-items a#" + model.id).closest('li').addClass('current');
      };

      QuizProgressView.prototype.onQuestionSubmitted = function(responseModel) {
        var answer, className, _ref;
        console.log('question submitted- progress page');
        console.log(responseModel);
        answer = responseModel.get('question_response');
        if ((_ref = answer.status) === 'correct_answer' || _ref === 'partially_correct') {
          className = 'right';
        } else {
          className = 'wrong';
        }
        return this.$el.find("a#" + responseModel.get('content_piece_id')).closest('li').removeClass('wrong').removeClass('right').removeClass('skip').addClass(className);
      };

      return QuizProgressView;

    })(Marionette.CompositeView);
  });
});

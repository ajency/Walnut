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
        this.questionsCollection = opts.questionsCollection, currentQuestion = opts.currentQuestion, this.questionResponseCollection = opts.questionResponseCollection, this.quizModel = opts.quizModel;
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
          currentQuestion: currentQuestion,
          questionResponseCollection: this.questionResponseCollection,
          quizModel: this.quizModel
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
        data.totalQuestions = this.collection.length;
        return data;
      };

      QuizProgressView.prototype.onShow = function() {
        var currentQuestion, questionResponseCollection;
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
        questionResponseCollection = Marionette.getOption(this, 'questionResponseCollection');
        questionResponseCollection.each((function(_this) {
          return function(response) {
            return _this.changeClassName(response);
          };
        })(this));
        this.onQuestionChange(currentQuestion);
        this.updateProgressBar();
        return this.updateSkippedCount();
      };

      QuizProgressView.prototype.onQuestionChange = function(model) {
        this.$el.find("#quiz-items li").removeClass('current');
        return this.$el.find("#quiz-items a#" + model.id).closest('li').addClass('current');
      };

      QuizProgressView.prototype.onQuestionSubmitted = function(responseModel) {
        var quizModel;
        quizModel = Marionette.getOption(this, 'quizModel');
        if (quizModel.hasPermission('display_answer')) {
          this.changeClassName(responseModel);
        }
        this.updateProgressBar();
        return this.updateSkippedCount();
      };

      QuizProgressView.prototype.changeClassName = function(responseModel) {
        var answer, className, _ref;
        answer = responseModel.get('question_response');
        if ((_ref = answer.status) === 'correct_answer' || _ref === 'partially_correct') {
          className = 'right';
        }
        if (answer.status === 'wrong_answer') {
          className = 'wrong';
        }
        if (answer.status === 'skipped') {
          className = 'skip';
        }
        return this.$el.find("a#" + responseModel.get('content_piece_id')).closest('li').removeClass('wrong').removeClass('right').removeClass('skip').addClass(className);
      };

      QuizProgressView.prototype.updateProgressBar = function() {
        var answeredQuestions, progressPercentage, questionResponseCollection, responses;
        questionResponseCollection = Marionette.getOption(this, 'questionResponseCollection');
        responses = questionResponseCollection.pluck('question_response');
        answeredQuestions = _.chain(responses).map(function(m) {
          if (m.status !== 'skipped') {
            return m;
          }
        }).compact().size().value();
        progressPercentage = (answeredQuestions / this.collection.length) * 100;
        this.$el.find("#quiz-progress-bar").attr("data-percentage", progressPercentage + '%').css({
          "width": progressPercentage + '%'
        });
        return this.$el.find("#answered-questions").html(answeredQuestions);
      };

      QuizProgressView.prototype.updateSkippedCount = function() {
        var answers, questionResponseCollection, skipped;
        questionResponseCollection = Marionette.getOption(this, 'questionResponseCollection');
        answers = questionResponseCollection.pluck('question_response');
        skipped = _.where(answers, {
          'status': 'skipped'
        });
        return this.$el.find("#skipped-questions").html(_.size(skipped));
      };

      return QuizProgressView;

    })(Marionette.CompositeView);
  });
});

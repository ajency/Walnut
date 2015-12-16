var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/quiz-modules/take-quiz-module/quiz-progress/templates/quiz-progress-tpl.html'], function(App, RegionController, quizProgressTemplate) {
  return App.module("TakeQuizApp.QuizProgress", function(QuizProgress, App) {
    var QuestionProgressView, QuizProgressView;
    QuizProgress.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._showQuizProgressView = bind(this._showQuizProgressView, this);
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
        this.listenTo(this.region, "question:changed", function(selectedQID) {
          return this.view.triggerMethod("question:change", selectedQID);
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
    QuestionProgressView = (function(superClass) {
      extend(QuestionProgressView, superClass);

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
    return QuizProgressView = (function(superClass) {
      extend(QuizProgressView, superClass);

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
        'click #quiz-items a': 'changeQuestion'
      };

      QuizProgressView.prototype.mixinTemplateHelpers = function(data) {
        data.totalQuestions = this.collection.length;
        if (this.quizModel.hasPermission('single_attempt')) {
          data.showSkipped = true;
        }
        return data;
      };

      QuizProgressView.prototype.initialize = function() {
        this.questionResponseCollection = Marionette.getOption(this, 'questionResponseCollection');
        return this.quizModel = Marionette.getOption(this, 'quizModel');
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
        if (this.collection.length < 10) {
          this.$el.find('.customButtons').remove();
        }
        currentQuestion = Marionette.getOption(this, 'currentQuestion');
        this.questionResponseCollection.each((function(_this) {
          return function(response) {
            if (_this.quizModel.hasPermission('display_answer') || response.get('status') === 'skipped') {
              return _this.changeClassName(response);
            }
          };
        })(this));
        this.onQuestionChange(currentQuestion);
        this.updateProgressBar();
        return this.updateSkippedCount();
      };

      QuizProgressView.prototype.changeQuestion = function(e) {
        var selectedQID;
        selectedQID = parseInt($(e.target).attr('id'));
        if (_.contains(this.questionResponseCollection.pluck('content_piece_id'), selectedQID) || !this.quizModel.hasPermission('single_attempt')) {
          return this.trigger("change:question", selectedQID);
        }
      };

      QuizProgressView.prototype.onQuestionChange = function(model) {
        this.$el.find("#quiz-items li").removeClass('current');
        return this.$el.find("#quiz-items a#" + model.id).closest('li').addClass('current');
      };

      QuizProgressView.prototype.onQuestionSubmitted = function(responseModel) {
        this.updateProgressBar();
        this.updateSkippedCount();
        if (responseModel.get('status') === 'skipped' && !this.quizModel.hasPermission('single_attempt')) {
          return false;
        } else if (this.quizModel.hasPermission('display_answer') || responseModel.get('status') === 'skipped') {
          return this.changeClassName(responseModel);
        }
      };

      QuizProgressView.prototype.changeClassName = function(responseModel) {
        var className, status;
        status = responseModel.get('status');
        className = (function() {
          switch (status) {
            case 'correct_answer':
              return 'right';
            case 'partially_correct':
              return 'partiallyCorrect';
            case 'wrong_answer':
              return 'wrong';
            case 'skipped':
              return 'skip';
          }
        })();
        return this.$el.find("a#" + responseModel.get('content_piece_id')).closest('li').removeClass('right wrong skip partiallyCorrect').addClass(className);
      };

      QuizProgressView.prototype.updateProgressBar = function() {
        var answeredQuestions, progressPercentage, skipped;
        skipped = _.size(this.questionResponseCollection.where({
          'status': 'skipped'
        }));
        answeredQuestions = this.questionResponseCollection.length - skipped;
        progressPercentage = (answeredQuestions / this.collection.length) * 100;
        this.$el.find("#quiz-progress-bar").attr("data-percentage", progressPercentage + '%').attr("aria-valuenow", progressPercentage).css({
          "width": progressPercentage + '%'
        });
        return this.$el.find("#answered-questions").html(answeredQuestions);
      };

      QuizProgressView.prototype.updateSkippedCount = function() {
        var skipped;
        skipped = _.size(this.questionResponseCollection.where({
          'status': 'skipped'
        }));
        return this.$el.find("#skipped-questions").html(skipped);
      };

      return QuizProgressView;

    })(Marionette.CompositeView);
  });
});

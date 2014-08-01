var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/take-quiz-module/quiz-description/app', 'apps/quiz-modules/take-quiz-module/quiz-progress/app', 'apps/quiz-modules/take-quiz-module/quiz-timer/app', 'apps/quiz-modules/take-quiz-module/single-question/app'], function(App, RegionController) {
  return App.module("TakeQuizApp", function(View, App) {
    var TakeQuizLayout, questionIDs, questionModel, questionResponseCollection, questionResponseModel, questionsCollection, quizModel, textbookNames;
    quizModel = null;
    questionsCollection = null;
    questionResponseCollection = null;
    questionResponseModel = null;
    questionModel = null;
    questionIDs = null;
    textbookNames = null;
    View.TakeQuizController = (function(_super) {
      __extends(TakeQuizController, _super);

      function TakeQuizController() {
        return TakeQuizController.__super__.constructor.apply(this, arguments);
      }

      TakeQuizController.prototype.initialize = function(opts) {
        var layout, questionID;
        quizModel = opts.quizModel, questionsCollection = opts.questionsCollection, questionResponseCollection = opts.questionResponseCollection, textbookNames = opts.textbookNames;
        this.display_mode = 'quiz_mode';
        App.leftNavRegion.close();
        App.headerRegion.close();
        App.breadcrumbRegion.close();
        questionIDs = questionsCollection.pluck('ID');
        questionIDs = _.map(questionIDs, function(m) {
          return parseInt(m);
        });
        questionID = _.first(questionIDs);
        questionModel = questionsCollection.get(questionID);
        this.layout = layout = new TakeQuizLayout;
        this.show(this.layout, {
          loading: true
        });
        this.timerObject = new Backbone.Wreqr.RequestResponse();
        this.listenTo(this.layout, "show", this._showQuizViews);
        this.listenTo(this.layout.questionDisplayRegion, "goto:next:question", this._gotoNextQuestion);
        this.listenTo(this.layout.questionDisplayRegion, "submit:question", this._submitQuestion);
        this.listenTo(this.layout.questionDisplayRegion, "goto:previous:question", this._gotoPreviousQuestion);
        this.listenTo(this.layout.questionDisplayRegion, "skip:question", this._skipQuestion);
        this.listenTo(this.layout.quizTimerRegion, "end:quiz", this._endQuiz);
        return this.listenTo(this.layout.quizProgressRegion, "change:question", this._changeQuestion);
      };

      TakeQuizController.prototype._changeQuestion = function(id) {
        questionModel = questionsCollection.get(id);
        return this._showSingleQuestionApp(questionModel);
      };

      TakeQuizController.prototype._submitQuestion = function(answer) {
        var data, newResponseModel, quizResponseModel;
        data = {
          'collection_id': quizModel.id,
          'content_piece_id': questionModel.id,
          'question_response': answer.toJSON()
        };
        newResponseModel = App.request("create:quiz:response:model", data);
        quizResponseModel = questionResponseCollection.findWhere({
          'content_piece_id': newResponseModel.get('content_piece_id')
        });
        if (quizResponseModel) {
          console.log('update model');
          quizResponseModel.set(newResponseModel.toJSON());
        } else {
          console.log('new model');
          quizResponseModel = newResponseModel;
          questionResponseCollection.add(newResponseModel);
        }
        return this.layout.quizProgressRegion.trigger("question:submitted", quizResponseModel);
      };

      TakeQuizController.prototype._skipQuestion = function(answer) {
        this._submitQuestion(answer);
        return this._gotoNextQuestion();
      };

      TakeQuizController.prototype._gotoNextQuestion = function() {
        var nextQuestionID;
        if (questionModel != null) {
          nextQuestionID = this._getNextItemID();
        }
        if (nextQuestionID) {
          questionModel = questionsCollection.get(nextQuestionID);
          return this._showSingleQuestionApp(questionModel);
        } else {
          return this._endQuiz();
        }
      };

      TakeQuizController.prototype._endQuiz = function() {
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          questionsCollection: questionsCollection,
          questionResponseCollection: questionResponseCollection
        });
      };

      TakeQuizController.prototype._gotoPreviousQuestion = function() {
        var prevQuestionID;
        if (questionModel != null) {
          prevQuestionID = this._getPrevItemID();
        }
        if (prevQuestionID) {
          questionModel = questionsCollection.get(prevQuestionID);
          return this._showSingleQuestionApp(questionModel);
        }
      };

      TakeQuizController.prototype._getNextItemID = function() {
        var nextID, nextIndex, pieceIndex;
        pieceIndex = _.indexOf(questionIDs, questionModel.id);
        nextIndex = pieceIndex + 1;
        if (nextIndex < questionIDs.length) {
          nextID = parseInt(questionIDs[nextIndex]);
        }
        return nextID;
      };

      TakeQuizController.prototype._getPrevItemID = function() {
        var pieceIndex, prevID;
        pieceIndex = _.indexOf(questionIDs, questionModel.id);
        if (pieceIndex > 0) {
          return prevID = parseInt(questionIDs[pieceIndex - 1]);
        }
      };

      TakeQuizController.prototype._showSingleQuestionApp = function() {
        if (questionModel) {
          new View.SingleQuestion.Controller({
            region: this.layout.questionDisplayRegion,
            model: questionModel,
            questionResponseCollection: questionResponseCollection
          });
          this.layout.quizProgressRegion.trigger("question:changed", questionModel);
          return this.layout.quizDescriptionRegion.trigger("question:changed", questionModel);
        }
      };

      TakeQuizController.prototype._showQuizViews = function() {
        new View.QuizDescription.Controller({
          region: this.layout.quizDescriptionRegion,
          model: quizModel,
          currentQuestion: questionModel,
          textbookNames: textbookNames
        });
        new View.QuizProgress.Controller({
          region: this.layout.quizProgressRegion,
          questionsCollection: questionsCollection,
          currentQuestion: questionModel,
          questionResponseCollection: questionResponseCollection
        });
        new View.QuizTimer.Controller({
          region: this.layout.quizTimerRegion,
          model: quizModel,
          display_mode: this.display_mode
        });
        return this._showSingleQuestionApp(questionModel);
      };

      return TakeQuizController;

    })(RegionController);
    TakeQuizLayout = (function(_super) {
      __extends(TakeQuizLayout, _super);

      function TakeQuizLayout() {
        return TakeQuizLayout.__super__.constructor.apply(this, arguments);
      }

      TakeQuizLayout.prototype.template = '<div id="quiz-description-region"></div> <div class="sidebarContainer"> <div id="quiz-timer-region"></div> <div id="quiz-progress-region"></div> </div> <div id="question-display-region"></div>';

      TakeQuizLayout.prototype.regions = {
        quizDescriptionRegion: '#quiz-description-region',
        quizTimerRegion: '#quiz-timer-region',
        quizProgressRegion: '#quiz-progress-region',
        questionDisplayRegion: '#question-display-region'
      };

      TakeQuizLayout.prototype.className = 'content';

      TakeQuizLayout.prototype.onShow = function() {
        return $('.page-content').addClass('condensed expand-page');
      };

      return TakeQuizLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("start:take:quiz:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.TakeQuizController(opt);
    });
  });
});

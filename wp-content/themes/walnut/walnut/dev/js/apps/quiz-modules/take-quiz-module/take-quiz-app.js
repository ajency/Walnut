var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/take-quiz-module/quiz-description/app', 'apps/quiz-modules/take-quiz-module/quiz-progress/app', 'apps/quiz-modules/take-quiz-module/quiz-timer/app', 'apps/quiz-modules/take-quiz-module/single-question/app', 'apps/popup-dialog/alerts'], function(App, RegionController) {
  return App.module("TakeQuizApp", function(View, App) {
    var TakeQuizLayout, questionIDs, questionModel, questionResponseCollection, questionResponseModel, questionsCollection, quizModel, timeBeforeCurrentQuestion;
    quizModel = null;
    questionsCollection = null;
    questionResponseCollection = null;
    questionResponseModel = null;
    questionModel = null;
    questionIDs = null;
    timeBeforeCurrentQuestion = null;
    View.TakeQuizController = (function(_super) {
      __extends(TakeQuizController, _super);

      function TakeQuizController() {
        return TakeQuizController.__super__.constructor.apply(this, arguments);
      }

      TakeQuizController.prototype.initialize = function(opts) {
        var layout, questionID;
        quizModel = opts.quizModel, questionsCollection = opts.questionsCollection, questionResponseCollection = opts.questionResponseCollection, this.textbookNames = opts.textbookNames, this.display_mode = opts.display_mode;
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
        this.listenTo(this.layout.questionDisplayRegion, "skip:question", this._skipQuestion);
        this.listenTo(this.layout.questionDisplayRegion, "show:alert:popup", this._showPopup);
        this.listenTo(this.layout.quizTimerRegion, "show:alert:popup", this._showPopup);
        this.listenTo(this.layout.quizProgressRegion, "change:question", this._changeQuestion);
        return this.listenTo(App.dialogRegion, "clicked:confirm:yes", this._handlePopups);
      };

      TakeQuizController.prototype._changeQuestion = function(id) {
        questionModel = questionsCollection.get(id);
        return this._showSingleQuestionApp(questionModel);
      };

      TakeQuizController.prototype._submitQuestion = function(answer) {
        var data, newResponseModel, quizResponseModel, timeTaken, totalTime;
        totalTime = this.timerObject.request("get:elapsed:time");
        timeTaken = totalTime - timeBeforeCurrentQuestion;
        timeBeforeCurrentQuestion = totalTime;
        data = {
          'collection_id': quizModel.id,
          'content_piece_id': questionModel.id,
          'question_response': answer.toJSON(),
          'status': answer.get('status'),
          'time_taken': timeTaken
        };
        newResponseModel = App.request("create:quiz:response:model", data);
        quizResponseModel = questionResponseCollection.findWhere({
          'content_piece_id': newResponseModel.get('content_piece_id')
        });
        if (quizResponseModel) {
          quizResponseModel.set(newResponseModel.toJSON());
        } else {
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

      TakeQuizController.prototype._showPopup = function(message_type) {
        return App.execute('show:alert:popup', {
          region: App.dialogRegion,
          message_content: quizModel.getMessageContent(message_type),
          alert_type: 'confirm',
          message_type: message_type
        });
      };

      TakeQuizController.prototype._endQuiz = function() {
        var unanswered;
        unanswered = this._getUnansweredIDs();
        if (unanswered) {
          _.each(unanswered, (function(_this) {
            return function(question, index) {
              var answerModel;
              questionModel = questionsCollection.get(question);
              answerModel = App.request("create:new:answer");
              answerModel.set({
                'status': 'wrong_answer'
              });
              return _this._submitQuestion(answerModel);
            };
          })(this));
        }
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          questionsCollection: questionsCollection,
          questionResponseCollection: questionResponseCollection
        });
      };

      TakeQuizController.prototype._getUnansweredIDs = function() {
        var allIDs, answeredIDs, unanswered;
        answeredIDs = questionResponseCollection.pluck('content_piece_id');
        allIDs = _.map(quizModel.get('content_pieces'), function(m) {
          return parseInt(m);
        });
        return unanswered = _.difference(allIDs, answeredIDs);
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
        var nextID, nextIndex, pieceIndex, unanswered;
        pieceIndex = _.indexOf(questionIDs, questionModel.id);
        nextIndex = pieceIndex + 1;
        if (nextIndex < questionIDs.length) {
          nextID = parseInt(questionIDs[nextIndex]);
        } else {
          unanswered = this._getUnansweredIDs();
          if (unanswered) {
            nextID = _.first(_.intersection(questionIDs, unanswered));
          }
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
            quizModel: quizModel,
            questionResponseCollection: questionResponseCollection,
            display_mode: this.display_mode
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
          textbookNames: this.textbookNames
        });
        new View.QuizProgress.Controller({
          region: this.layout.quizProgressRegion,
          questionsCollection: questionsCollection,
          currentQuestion: questionModel,
          quizModel: quizModel,
          questionResponseCollection: questionResponseCollection
        });
        new View.QuizTimer.Controller({
          region: this.layout.quizTimerRegion,
          model: quizModel,
          display_mode: this.display_mode,
          timerObject: this.timerObject
        });
        return this._showSingleQuestionApp(questionModel);
      };

      TakeQuizController.prototype._handlePopups = function(message_type) {
        console.log(message_type);
        switch (message_type) {
          case 'end_quiz':
            return this._endQuiz();
          case 'submit_without_attempting':
            return this.layout.questionDisplayRegion.trigger("trigger:submit");
          case 'incomplete_answer':
            return this.layout.questionDisplayRegion.trigger("trigger:submit");
        }
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

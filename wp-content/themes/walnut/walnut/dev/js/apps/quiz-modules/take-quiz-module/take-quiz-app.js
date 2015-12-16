var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/quiz-modules/take-quiz-module/quiz-description/app', 'apps/quiz-modules/take-quiz-module/quiz-progress/app', 'apps/quiz-modules/take-quiz-module/quiz-timer/app', 'apps/quiz-modules/take-quiz-module/single-question/app'], function(App, RegionController) {
  return App.module("TakeQuizApp", function(View, App) {
    var TakeQuizLayout, pausedQuestionTime, questionIDs, questionModel, questionResponseModel, questionsCollection, quizModel, quizResponseSummary, studentTrainingModule, timeBeforeCurrentQuestion;
    quizModel = null;
    quizResponseSummary = null;
    questionsCollection = null;
    questionResponseModel = null;
    questionModel = null;
    questionIDs = null;
    timeBeforeCurrentQuestion = null;
    pausedQuestionTime = 0;
    studentTrainingModule = null;
    View.TakeQuizController = (function(superClass) {
      extend(TakeQuizController, superClass);

      function TakeQuizController() {
        this._saveQuizResponseModel = bind(this._saveQuizResponseModel, this);
        this._changeQuestion = bind(this._changeQuestion, this);
        this._autosaveQuestionTime = bind(this._autosaveQuestionTime, this);
        this._startTakeQuiz = bind(this._startTakeQuiz, this);
        return TakeQuizController.__super__.constructor.apply(this, arguments);
      }

      TakeQuizController.prototype.initialize = function(opts) {
        quizModel = opts.quizModel, quizResponseSummary = opts.quizResponseSummary, questionsCollection = opts.questionsCollection, this.questionResponseCollection = opts.questionResponseCollection, this.textbookNames = opts.textbookNames, this.display_mode = opts.display_mode, studentTrainingModule = opts.studentTrainingModule;
        return this._startTakeQuiz();
      };

      TakeQuizController.prototype._startTakeQuiz = function() {
        var data, layout, pausedQuestion, questionID, unanswered;
        if (!this.questionResponseCollection) {
          this.questionResponseCollection = App.request("create:empty:question:response:collection");
          timeBeforeCurrentQuestion = 0;
        }
        App.leftNavRegion.reset();
        App.headerRegion.reset();
        questionIDs = questionsCollection.pluck('ID');
        questionIDs = _.map(questionIDs, function(m) {
          return parseInt(m);
        });
        pausedQuestion = this.questionResponseCollection.findWhere({
          'status': 'paused'
        });
        if (pausedQuestion) {
          questionID = pausedQuestion.get('content_piece_id');
          pausedQuestionTime = parseInt(pausedQuestion.get('time_taken'));
        } else {
          unanswered = this._getUnansweredIDs();
          if (!_.isEmpty(unanswered)) {
            questionID = _.first(this._getUnansweredIDs());
          } else {
            if (!questionID) {
              questionID = _.first(questionIDs);
            }
          }
        }
        if (quizResponseSummary.isNew()) {
          data = {
            'status': 'started',
            'questions_order': questionIDs
          };
          quizModel.set({
            'attempts': parseInt(quizModel.get('attempts')) + 1
          });
          quizResponseSummary.save(data);
        }
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
        this.listenTo(this.layout.quizTimerRegion, "show:single:quiz:app", this._showSingleQuizApp);
        this.listenTo(this.layout.quizProgressRegion, "change:question", this._changeQuestion);
        return setInterval((function(_this) {
          return function() {
            var time;
            time = _this.timerObject.request("get:elapsed:time");
            if (time && quizResponseSummary.get('status') !== 'completed') {
              return _this._autosaveQuestionTime();
            }
          };
        })(this), 30000);
      };

      TakeQuizController.prototype._autosaveQuestionTime = function() {
        var data, ref, timeTaken, totalTime;
        questionResponseModel = this.questionResponseCollection.findWhere({
          'content_piece_id': questionModel.id
        });
        totalTime = this.timerObject.request("get:elapsed:time");
        timeTaken = totalTime + pausedQuestionTime - timeBeforeCurrentQuestion;
        pausedQuestionTime = 0;
        if ((!questionResponseModel) || ((ref = questionResponseModel.get('status')) === 'not_started' || ref === 'paused')) {
          if (questionResponseModel) {
            console.log(questionResponseModel.get('status'));
          }
          data = {
            'summary_id': quizResponseSummary.id,
            'content_piece_id': questionModel.id,
            'question_response': [],
            'status': 'paused',
            'marks_scored': 0,
            'time_taken': timeTaken
          };
          questionResponseModel = App.request("create:quiz:question:response:model", data);
        } else {
          questionResponseModel.set({
            'time_taken': timeTaken
          });
        }
        return this._saveQuizResponseModel(questionResponseModel);
      };

      TakeQuizController.prototype._changeQuestion = function(changeToQuestion) {
        questionModel = questionsCollection.get(changeToQuestion);
        return this._showSingleQuestionApp();
      };

      TakeQuizController.prototype._submitQuestion = function(answer) {
        var data, newResponseModel, timeTaken, totalTime;
        totalTime = this.timerObject.request("get:elapsed:time");
        timeTaken = totalTime + pausedQuestionTime - timeBeforeCurrentQuestion;
        pausedQuestionTime = 0;
        timeBeforeCurrentQuestion = totalTime;
        data = {
          'summary_id': quizResponseSummary.id,
          'content_piece_id': questionModel.id,
          'question_response': _.omit(answer.toJSON(), ['marks', 'status']),
          'status': answer.get('status'),
          'marks_scored': answer.get('marks'),
          'time_taken': timeTaken
        };
        newResponseModel = App.request("create:quiz:question:response:model", data);
        return this._saveQuizResponseModel(newResponseModel);
      };

      TakeQuizController.prototype._saveQuizResponseModel = function(newResponseModel) {
        var quizResponseModel;
        quizResponseModel = this.questionResponseCollection.findWhere({
          'content_piece_id': newResponseModel.get('content_piece_id')
        });
        if (quizResponseModel) {
          quizResponseModel.set(newResponseModel.toJSON());
        } else {
          quizResponseModel = newResponseModel;
          this.questionResponseCollection.add(newResponseModel);
        }
        quizResponseModel.save();
        if (quizResponseModel.get('status') !== 'paused') {
          return this.layout.quizProgressRegion.trigger("question:submitted", quizResponseModel);
        }
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
          return this._showSingleQuestionApp();
        } else {
          return this._showSingleQuizApp();
        }
      };

      TakeQuizController.prototype._endQuiz = function() {
        var ref, ref1, unanswered;
        questionResponseModel = this.questionResponseCollection.findWhere({
          'content_piece_id': questionModel.id
        });
        if ((ref = this.display_mode) !== 'replay' && ref !== 'quiz_report') {
          if ((!questionResponseModel) || ((ref1 = questionResponseModel.get('status')) === 'paused' || ref1 === 'not_attempted')) {
            this.layout.questionDisplayRegion.trigger("silent:save:question");
          }
          unanswered = this._getUnansweredIDs();
          if (unanswered) {
            _.each(unanswered, (function(_this) {
              return function(question, index) {
                var answerModel;
                questionModel = questionsCollection.get(question);
                answerModel = App.request("create:new:answer");
                answerModel.set({
                  'status': 'skipped'
                });
                return _this._submitQuestion(answerModel);
              };
            })(this));
          }
          quizResponseSummary.set({
            'status': 'completed',
            'total_time_taken': timeBeforeCurrentQuestion,
            'num_skipped': _.size(this.questionResponseCollection.where({
              'status': 'skipped'
            })),
            'marks_scored': this.questionResponseCollection.getMarksScored(),
            'negative_scored': this.questionResponseCollection.getNegativeScored(),
            'total_marks_scored': this.questionResponseCollection.getTotalScored()
          });
          quizResponseSummary.save();
          return this._queueStudentMail();
        }
      };

      TakeQuizController.prototype._showSingleQuizApp = function() {
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          questionsCollection: questionsCollection,
          questionResponseCollection: this.questionResponseCollection,
          quizResponseSummary: quizResponseSummary,
          display_mode: this.display_mode,
          studentTrainingModule: studentTrainingModule
        });
      };

      TakeQuizController.prototype._queueStudentMail = function() {
        var data;
        data = {
          component: 'quiz',
          communication_type: 'quiz_completed_student_mail',
          communication_mode: 'email',
          additional_data: {
            quiz_id: quizModel.id
          }
        };
        return App.request("save:communications", data);
      };

      TakeQuizController.prototype._getUnansweredIDs = function() {
        var allIDs, answeredIDs, pausedModel, unanswered;
        pausedModel = this.questionResponseCollection.findWhere({
          'status': 'paused'
        });
        answeredIDs = this.questionResponseCollection.pluck('content_piece_id');
        if (pausedModel) {
          answeredIDs = _.without(answeredIDs, pausedModel.get('content_piece_id'));
        }
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
          return this._showSingleQuestionApp({
            direction: 'rtl'
          });
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

      TakeQuizController.prototype._showSingleQuestionApp = function(direction) {
        var display_mode;
        if (direction == null) {
          direction = 'ltr';
        }
        display_mode = this.display_mode === 'quiz_report' ? 'replay' : this.display_mode;
        if (questionModel) {
          new View.SingleQuestion.Controller({
            region: this.layout.questionDisplayRegion,
            model: questionModel,
            quizModel: quizModel,
            questionResponseCollection: this.questionResponseCollection,
            display_mode: display_mode,
            direction: direction
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
          textbookNames: this.textbookNames,
          display_mode: this.display_mode
        });
        new View.QuizProgress.Controller({
          region: this.layout.quizProgressRegion,
          questionsCollection: questionsCollection,
          currentQuestion: questionModel,
          quizModel: quizModel,
          questionResponseCollection: this.questionResponseCollection
        });
        new View.QuizTimer.Controller({
          region: this.layout.quizTimerRegion,
          model: quizModel,
          display_mode: this.display_mode,
          timerObject: this.timerObject,
          quizResponseSummary: quizResponseSummary
        });
        return this._showSingleQuestionApp();
      };

      return TakeQuizController;

    })(RegionController);
    TakeQuizLayout = (function(superClass) {
      extend(TakeQuizLayout, superClass);

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

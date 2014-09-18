var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/layout', 'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app', 'apps/quiz-modules/view-single-quiz/content-display/content-display-app', 'apps/quiz-modules/view-single-quiz/attempts/app', 'apps/quiz-modules/take-quiz-module/take-quiz-app'], function(App, RegionController) {
  return App.module("QuizModuleApp.ViewQuiz", function(ViewQuiz, App) {
    ViewQuiz.Controller = (function(_super) {
      var display_mode, questionsCollection, quizModel, quizResponseSummary, quizResponseSummaryCollection;

      __extends(Controller, _super);

      function Controller() {
        this._getQuizViewLayout = __bind(this._getQuizViewLayout, this);
        this._showAttemptsRegion = __bind(this._showAttemptsRegion, this);
        this.showQuizViews = __bind(this.showQuizViews, this);
        this.startQuiz = __bind(this.startQuiz, this);
        this._fetchQuestionResponseCollection = __bind(this._fetchQuestionResponseCollection, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      quizModel = null;

      questionsCollection = null;

      quizResponseSummary = null;

      quizResponseSummaryCollection = null;

      display_mode = null;

      Controller.prototype.initialize = function(opts) {
        var fetchQuestionResponseCollection, quiz_id;
        quiz_id = opts.quiz_id, quizModel = opts.quizModel, questionsCollection = opts.questionsCollection, this.questionResponseCollection = opts.questionResponseCollection, quizResponseSummary = opts.quizResponseSummary;
        if (!quizModel) {
          quizModel = App.request("get:quiz:by:id", quiz_id);
        }
        App.execute("show:headerapp", {
          region: App.headerRegion
        });
        App.execute("show:leftnavapp", {
          region: App.leftNavRegion
        });
        this.fetchQuizResponseSummary = this._fetchQuizResponseSummary();
        fetchQuestionResponseCollection = this._fetchQuestionResponseCollection();
        return fetchQuestionResponseCollection.done((function(_this) {
          return function() {
            return App.execute("when:fetched", quizModel, function() {
              var textbook_termIDs;
              display_mode = 'class_mode';
              if (quizResponseSummary.get('status') === 'started') {
                display_mode = 'class_mode';
              }
              if (quizResponseSummary.get('status') === 'completed') {
                display_mode = 'replay';
              }
              textbook_termIDs = _.flatten(quizModel.get('term_ids'));
              _this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
              if (!_.isEmpty(quizResponseSummary.get('questions_order'))) {
                quizModel.set('content_pieces', quizResponseSummary.get('questions_order'));
              }
              if (!questionsCollection) {
                questionsCollection = App.request("get:content:pieces:by:ids", quizModel.get('content_pieces'));
                App.execute("when:fetched", questionsCollection, function() {
                  var actualMarks, multiplicationFactor;
                  actualMarks = 0;
                  questionsCollection.each(function(m) {
                    if (m.getMarks()) {
                      return actualMarks += m.getMarks();
                    }
                  });
                  if (actualMarks > 0) {
                    multiplicationFactor = quizModel.get('marks') / actualMarks;
                  }
                  if (multiplicationFactor) {
                    questionsCollection.each(function(m) {
                      return m.setMarks(multiplicationFactor);
                    });
                  }
                  if (quizResponseSummary.isNew() && quizModel.get('permissions').randomize) {
                    questionsCollection.each(function(e) {
                      return e.unset('order');
                    });
                    questionsCollection.reset(questionsCollection.shuffle());
                    return quizModel.set('content_pieces', questionsCollection.pluck('ID'));
                  }
                });
              }
              return App.execute("when:fetched", [questionsCollection, _this.textbookNames], function() {
                var layout;
                _this.layout = layout = _this._getQuizViewLayout();
                _this.show(_this.layout, {
                  loading: true
                });
                _this.listenTo(_this.layout, 'show', function() {
                  _this.showQuizViews();
                  return _this._showAttemptsRegion();
                });
                _this.listenTo(_this.layout.quizDetailsRegion, 'start:quiz:module', _this.startQuiz);
                _this.listenTo(_this.layout.quizDetailsRegion, 'try:again', _this._tryAgain);
                return _this.listenTo(_this.layout.attemptsRegion, 'view:summary', _this._viewSummary);
              });
            });
          };
        })(this));
      };

      Controller.prototype._tryAgain = function() {
        if (quizModel.get('quiz_type') !== 'practice') {
          return false;
        }
        this.questionResponseCollection = null;
        quizModel.set({
          'attempts': parseInt(quizModel.get('attempts')) + 1
        });
        this.summary_data = {
          'collection_id': quizModel.get('id'),
          'student_id': App.request("get:loggedin:user:id"),
          'taken_on': moment().format("YYYY-MM-DD")
        };
        quizResponseSummary = App.request("create:quiz:response:summary", this.summary_data);
        quizResponseSummaryCollection.add(quizResponseSummary);
        display_mode = 'class_mode';
        return this.startQuiz();
      };

      Controller.prototype._viewSummary = function(summary_id) {
        var fetchResponses;
        quizResponseSummary = quizResponseSummaryCollection.get(summary_id);
        this.questionResponseCollection = null;
        fetchResponses = this._fetchQuestionResponseCollection();
        return fetchResponses.done((function(_this) {
          return function() {
            _this.layout.$el.find('#quiz-details-region,#content-display-region').hide();
            _this.layout.$el.find('#quiz-details-region,#content-display-region').fadeIn('slow');
            _this.showQuizViews();
            return _this.layout.attemptsRegion.$el.find('.view-summary i').removeClass('fa fa-spin fa-spinner');
          };
        })(this));
      };

      Controller.prototype._fetchQuizResponseSummary = function() {
        var defer;
        defer = $.Deferred();
        if (quizResponseSummary) {
          defer.resolve();
          return defer.promise();
        }
        this.summary_data = {
          'collection_id': quizModel.get('id'),
          'student_id': App.request("get:loggedin:user:id"),
          'taken_on': moment().format("YYYY-MM-DD")
        };
        quizResponseSummaryCollection = App.request("get:quiz:response:summary", this.summary_data);
        App.execute("when:fetched", quizResponseSummaryCollection, (function(_this) {
          return function() {
            if (quizResponseSummaryCollection.length > 0) {
              quizResponseSummary = quizResponseSummaryCollection.last();
              return defer.resolve();
            } else {
              quizResponseSummary = App.request("create:quiz:response:summary", _this.summary_data);
              quizResponseSummaryCollection.add(quizResponseSummary);
              quizModel.set({
                'attempts': parseInt(quizModel.get('attempts')) + 1
              });
              return defer.resolve();
            }
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype._fetchQuestionResponseCollection = function() {
        var defer;
        defer = $.Deferred();
        this.fetchQuizResponseSummary.done((function(_this) {
          return function() {
            if (!_this.questionResponseCollection && !quizResponseSummary.isNew()) {
              _this.questionResponseCollection = App.request("get:quiz:question:response:collection", {
                'summary_id': quizResponseSummary.get('summary_id')
              });
              return App.execute("when:fetched", _this.questionResponseCollection, function() {
                return defer.resolve();
              });
            } else {
              return defer.resolve();
            }
          };
        })(this));
        return defer.promise();
      };

      Controller.prototype.startQuiz = function() {
        return App.execute("start:take:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          quizResponseSummary: quizResponseSummary,
          questionsCollection: questionsCollection,
          display_mode: display_mode,
          questionResponseCollection: this.questionResponseCollection,
          textbookNames: this.textbookNames
        });
      };

      Controller.prototype.showQuizViews = function() {
        App.execute("show:view:quiz:detailsapp", {
          region: this.layout.quizDetailsRegion,
          model: quizModel,
          display_mode: display_mode,
          quizResponseSummary: quizResponseSummary,
          textbookNames: this.textbookNames
        });
        if (quizResponseSummary.get('status') === 'completed') {
          return App.execute("show:quiz:items:app", {
            region: this.layout.contentDisplayRegion,
            model: quizModel,
            groupContentCollection: questionsCollection,
            questionResponseCollection: this.questionResponseCollection
          });
        }
      };

      Controller.prototype._showAttemptsRegion = function() {
        if (quizModel.get('quiz_type') === 'practice' && quizModel.get('attempts') > 0) {
          return App.execute("show:quiz:attempts:app", {
            region: this.layout.attemptsRegion,
            model: quizModel,
            quizResponseSummaryCollection: quizResponseSummaryCollection
          });
        }
      };

      Controller.prototype._getQuizViewLayout = function() {
        return new ViewQuiz.LayoutView.QuizViewLayout({
          model: quizModel
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:single:quiz:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ViewQuiz.Controller(opt);
    });
  });
});

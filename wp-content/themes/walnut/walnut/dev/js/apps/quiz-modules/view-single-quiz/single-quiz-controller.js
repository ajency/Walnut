var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app', 'apps/quiz-modules/view-single-quiz/content-display/content-display-app', 'apps/quiz-modules/take-quiz-module/take-quiz-app'], function(App, RegionController) {
  return App.module("QuizModuleApp.ViewQuiz", function(ViewQuiz, App) {
    var QuizViewLayout;
    ViewQuiz.Controller = (function(_super) {
      var questionResponseCollection, questionsCollection, quizModel;

      __extends(Controller, _super);

      function Controller() {
        this._getQuizViewLayout = __bind(this._getQuizViewLayout, this);
        this.showQuizViews = __bind(this.showQuizViews, this);
        this.startQuiz = __bind(this.startQuiz, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      quizModel = null;

      questionsCollection = null;

      questionResponseCollection = null;

      Controller.prototype.initialize = function(opts) {
        var quiz_id;
        quiz_id = opts.quiz_id, quizModel = opts.quizModel, questionsCollection = opts.questionsCollection, questionResponseCollection = opts.questionResponseCollection;
        if (!quizModel) {
          quizModel = App.request("get:quiz:by:id", quiz_id);
        }
        App.execute("show:headerapp", {
          region: App.headerRegion
        });
        App.execute("show:leftnavapp", {
          region: App.leftNavRegion
        });
        if (!questionResponseCollection) {
          questionResponseCollection = App.request("get:quiz:response:collection", {
            'collection_id': quizModel.get('id')
          });
        }
        return App.execute("when:fetched", quizModel, (function(_this) {
          return function() {
            var textbook_termIDs;
            textbook_termIDs = _.flatten(quizModel.get('term_ids'));
            _this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
            if (!questionsCollection) {
              questionsCollection = App.request("get:content:pieces:by:ids", quizModel.get('content_pieces'));
              App.execute("when:fetched", questionsCollection, function() {
                if (quizModel.get('permissions').randomize) {
                  questionsCollection.each(function(e) {
                    return e.unset('order');
                  });
                  return questionsCollection.reset(questionsCollection.shuffle());
                }
              });
            }
            return App.execute("when:fetched", [questionsCollection, _this.textbookNames], function() {
              var layout;
              _this.layout = layout = _this._getQuizViewLayout();
              _this.show(_this.layout, {
                loading: true
              });
              _this.listenTo(_this.layout, 'show', _this.showQuizViews);
              return _this.listenTo(_this.layout.quizDetailsRegion, 'start:quiz:module', _this.startQuiz);
            });
          };
        })(this));
      };

      Controller.prototype.startQuiz = function() {
        return App.execute("start:take:quiz:app", {
          region: App.mainContentRegion,
          quizModel: quizModel,
          questionsCollection: questionsCollection,
          display_mode: 'quiz_mode',
          questionResponseCollection: questionResponseCollection,
          textbookNames: this.textbookNames
        });
      };

      Controller.prototype.showQuizViews = function() {
        App.execute("show:view:quiz:detailsapp", {
          region: this.layout.quizDetailsRegion,
          model: quizModel,
          textbookNames: this.textbookNames
        });
        if (_.size(quizModel.get('content_pieces')) > 0) {
          return App.execute("show:quiz:items:app", {
            region: this.layout.contentDisplayRegion,
            model: quizModel,
            groupContentCollection: questionsCollection,
            questionResponseCollection: questionResponseCollection
          });
        }
      };

      Controller.prototype._getQuizViewLayout = function() {
        return new QuizViewLayout;
      };

      return Controller;

    })(RegionController);
    QuizViewLayout = (function(_super) {
      __extends(QuizViewLayout, _super);

      function QuizViewLayout() {
        return QuizViewLayout.__super__.constructor.apply(this, arguments);
      }

      QuizViewLayout.prototype.template = '<div class="teacher-app"> <div id="quiz-details-region"></div> </div> <div id="content-display-region"></div>';

      QuizViewLayout.prototype.regions = {
        quizDetailsRegion: '#quiz-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      QuizViewLayout.prototype.onShow = function() {
        return $('.page-content').removeClass('expand-page');
      };

      return QuizViewLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:single:quiz:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ViewQuiz.Controller(opt);
    });
  });
});

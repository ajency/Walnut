var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-report/quiz-list/composite-view', 'apps/quiz-reports/attempts/attempts-app'], function(App, RegionController) {
  return App.module("StudentReportApp.QuizList", function(QuizList, App) {
    return QuizList.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.student_id = opts.student_id;
        this.quizResponseSummaries = App.request("get:quiz:response:summary", {
          'student_id': this.student_id
        });
        if (App.request('current:user:can', 'reset_quiz')) {
          this.allowResetQuiz = true;
        }
        return App.execute("when:fetched", this.quizResponseSummaries, (function(_this) {
          return function() {
            var quiz_ids;
            _this.quizResponseSummaries.remove(_this.quizResponseSummaries.where({
              'status': 'started'
            }));
            quiz_ids = _this.quizResponseSummaries.pluck('collection_id');
            if (quiz_ids) {
              quiz_ids = _.uniq(quiz_ids);
            }
            _this.quizzes = !_.isEmpty(quiz_ids) ? App.request("get:quizes", {
              "quiz_ids": quiz_ids
            }) : App.request("empty:content:modules:collection");
            return App.execute("when:fetched", _this.quizzes, function() {
              var term_ids;
              term_ids = _.flatten(_this.quizzes.pluck('term_ids'));
              term_ids = _.chain(term_ids).map(function(t) {
                return _.flatten(t);
              }).flatten().uniq().compact().value();
              _this.textbookNames = App.request("get:textbook:names:by:ids", term_ids);
              return App.execute("when:fetched", _this.textbookNames, function() {
                return _this._showViews(_this.quizzes, _this.textbookNames);
              });
            });
          };
        })(this));
      };

      Controller.prototype._showViews = function(quizzes, textbookNames) {
        var view;
        this.view = view = this._getQuizListView(quizzes, textbookNames);
        this.show(view);
        this.listenTo(this.view, 'itemview:replay:quiz', this._replay_quiz);
        return this.listenTo(this.view, 'itemview:view:attempts', this._show_attempts_popup);
      };

      Controller.prototype._show_attempts_popup = function(itemview, quiz_id) {
        return App.execute("show:attempts:popup", {
          region: App.dialogRegion,
          student: this.student_id,
          quiz: this.quizzes.get(quiz_id),
          summaries: this.quizResponseSummaries.where({
            'collection_id': quiz_id
          })
        });
      };

      Controller.prototype._replay_quiz = function(itemview, quiz_id, summary_id) {
        var display_mode;
        if (this.student_id === App.request("get:loggedin:user:id")) {
          App.navigate("view-quiz/" + quiz_id);
        } else {
          App.navigate("quiz-report/student/" + this.student_id + "/quiz/" + quiz_id);
          display_mode = 'quiz_report';
        }
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: this.quizzes.get(quiz_id),
          quizResponseSummary: this.quizResponseSummaries.get(summary_id),
          quizResponseSummaryCollection: this.quizResponseSummaries,
          display_mode: display_mode,
          student: this.student_id
        });
      };

      Controller.prototype._getQuizListView = function(quizzes, textbookNames) {
        return new QuizList.Views.QuizListView({
          collection: quizzes,
          quizResponseSummaries: this.quizResponseSummaries,
          textbookNames: textbookNames,
          allowResetQuiz: this.allowResetQuiz
        });
      };

      return Controller;

    })(RegionController);
  });
});

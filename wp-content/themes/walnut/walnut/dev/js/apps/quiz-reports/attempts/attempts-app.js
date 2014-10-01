var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/attempts/composite-view'], function(App, RegionController) {
  return App.module('AttemptsPopupApp', function(AttemptsPopupApp, App) {
    AttemptsPopupApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getAttemptsView = __bind(this._getAttemptsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var quiz, student, summaries;
        student = options.student, quiz = options.quiz, summaries = options.summaries;
        this.studentModel = this._getStudentModel(student);
        this.quizModel = this._getQuizModel(quiz);
        this.summariesCollection = this._getSummaryCollection(summaries, quiz, student);
        return App.execute("when:fetched", [this.studentModel, this.quizModel, this.summariesCollection], (function(_this) {
          return function() {
            _this.view = _this._getAttemptsView();
            _this.show(_this.view);
            _this.listenTo(_this.view, 'close:popup:dialog', function() {
              return this.region.closeDialog();
            });
            return _this.listenTo(_this.view, 'itemview:replay:quiz', _this._replay_quiz);
          };
        })(this));
      };

      Controller.prototype._replay_quiz = function(itemview, summary_id) {
        var display_mode;
        if (this.studentModel.id === App.request("get:loggedin:user:id")) {
          App.navigate("view-quiz/" + this.quizModel.id);
        } else {
          App.navigate("quiz-report/student/" + this.studentModel.id + "/quiz/" + this.quizModel.id);
          display_mode = 'quiz_report';
        }
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: this.quizModel,
          quizResponseSummary: this.summariesCollection.get(summary_id),
          quizResponseSummaryCollection: this.summariesCollection,
          display_mode: display_mode,
          student: this.studentModel
        });
      };

      Controller.prototype._getStudentModel = function(student) {
        var studentModel;
        return studentModel = student instanceof Backbone.Model ? student : App.request("get:user:by:id", student);
      };

      Controller.prototype._getQuizModel = function(quiz) {
        var quizModel;
        return quizModel = quiz instanceof Backbone.Model ? quiz : App.request("get:quiz:by:id", quiz);
      };

      Controller.prototype._getSummaryCollection = function(summaries, quiz, student) {
        var quiz_id, student_id, summariesCollection;
        if (!summaries) {
          quiz_id = _.isNumber(quiz) ? quiz : quiz.id;
          student_id = _.isNumber(student) ? student : student.id;
          summariesCollection = App.request("get:quiz:response:summary", {
            'collection_id': quiz_id,
            'student_id': student_id
          });
        } else if (summaries instanceof Backbone.Collection) {
          summariesCollection = summaries;
        } else {
          summariesCollection = App.request("create:quiz:response:summary:collection", summaries);
        }
        return summariesCollection;
      };

      Controller.prototype._getAttemptsView = function() {
        return new AttemptsPopupApp.Views.AttemptsMainView({
          student: this.studentModel,
          quiz: this.quizModel,
          collection: this.summariesCollection
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:attempts:popup', function(options) {
      return new AttemptsPopupApp.Controller(options);
    });
  });
});

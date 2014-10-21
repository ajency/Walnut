var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/quiz-report/students-list/composite-view', 'apps/quiz-reports/attempts/attempts-app'], function(App, RegionController) {
  return App.module("QuizReportApp.StudentsList", function(StudentsList, App) {
    return StudentsList.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._show_attempts_popup = __bind(this._show_attempts_popup, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var data;
        this.students = opts.students, this.quizModel = opts.quizModel;
        data = {
          'student_ids': this.students.pluck('ID'),
          'collection_id': this.quizModel.id
        };
        this.quizResponseSummaries = App.request("get:quiz:response:summary", data);
        return App.execute("when:fetched", this.quizResponseSummaries, (function(_this) {
          return function() {
            var view;
            _this.quizResponseSummaries.remove(_this.quizResponseSummaries.where({
              'status': 'started'
            }));
            _this.view = view = _this._getStudentsListView(_this.students, _this.quizModel, _this.quizResponseSummaries);
            _this.show(view);
            _this.listenTo(_this.view, 'itemview:replay:quiz', _this._replay_quiz);
            return _this.listenTo(_this.view, 'itemview:view:attempts', _this._show_attempts_popup);
          };
        })(this));
      };

      Controller.prototype._show_attempts_popup = function(itemview, student_id) {
        return App.execute("show:attempts:popup", {
          region: App.dialogRegion,
          student: this.students.get(student_id),
          quiz: this.quizModel,
          summaries: this.quizResponseSummaries
        });
      };

      Controller.prototype._replay_quiz = function(itemview, student_id, summary_id) {
        return App.execute("show:single:quiz:app", {
          region: App.mainContentRegion,
          quizModel: this.quizModel,
          quizResponseSummary: this.quizResponseSummaries.get(summary_id),
          quizResponseSummaryCollection: this.quizResponseSummaries,
          display_mode: 'quiz_report',
          student: this.students.get(student_id)
        });
      };

      Controller.prototype._getStudentsListView = function(students, quizModel, summaries) {
        return new StudentsList.Views.StudentsDetailsView({
          collection: students,
          quizModel: quizModel,
          quizResponseSummaries: summaries
        });
      };

      return Controller;

    })(RegionController);
  });
});

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/quiz-report/quiz-report-layout', 'apps/quiz-reports/quiz-report/quiz-details/quiz-details-app', 'apps/quiz-reports/student-filter/student-filter-app', 'apps/quiz-reports/quiz-report/students-list/student-list-app'], function(App, RegionController) {
  return App.module("QuizReportApp", function(QuizReportApp, App) {
    QuizReportApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showViews = __bind(this._showViews, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var division, quiz;
        division = opts.division, quiz = opts.quiz, this.students = opts.students;
        this.divisionModel = division instanceof Backbone.Model ? division : App.request("get:division:by:id", division);
        this.quizModel = quiz instanceof Backbone.Model ? quiz : App.request("get:quiz:by:id", quiz);
        return App.execute("when:fetched", [this.divisionModel, this.quizModel], (function(_this) {
          return function() {
            if (_this.students instanceof Backbone.Collection) {
              return _this._showViews(_this.students);
            } else {
              _this.students = App.request("get:students:by:division", _this.divisionModel.id);
              return App.execute("when:fetched", _this.students, function() {
                return _this._showViews(_this.students);
              });
            }
          };
        })(this));
      };

      Controller.prototype._showViews = function(students) {
        this.layout = this._getQuizReportLayout(students);
        this.show(this.layout, {
          loading: true
        });
        return this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            var textbook_termIDs;
            App.execute("show:student:filter:app", {
              region: _this.layout.studentFilterRegion,
              students: students
            });
            textbook_termIDs = _.flatten(_this.quizModel.get('term_ids'));
            _this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
            App.execute("when:fetched", _this.textbookNames, function() {
              return new QuizReportApp.QuizDetails.Controller({
                region: _this.layout.quizDetailsRegion,
                model: _this.quizModel,
                textbookNames: _this.textbookNames,
                divisionModel: _this.divisionModel
              });
            });
            return new QuizReportApp.StudentsList.Controller({
              region: _this.layout.studentsListRegion,
              students: students,
              quizModel: _this.quizModel
            });
          };
        })(this));
      };

      Controller.prototype._getQuizReportLayout = function(students) {
        return new QuizReportApp.Layout.QuizReportLayout({
          students: students
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:quiz:report:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new QuizReportApp.Controller(opt);
    });
  });
});

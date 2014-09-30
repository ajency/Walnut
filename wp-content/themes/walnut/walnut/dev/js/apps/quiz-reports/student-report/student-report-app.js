var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-report/student-report-layout', 'apps/quiz-reports/student-filter/student-filter-app', 'apps/quiz-reports/student-report/quiz-list/quiz-list-app'], function(App, RegionController) {
  return App.module("StudentReportApp", function(StudentReportApp, App) {
    StudentReportApp.Controller = (function(_super) {
      var studentsCollection;

      __extends(Controller, _super);

      function Controller() {
        this._showViews = __bind(this._showViews, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      studentsCollection = null;

      Controller.prototype.initialize = function(opts) {
        var fetchStudents, students;
        students = opts.students, this.student_id = opts.student_id, this.display_mode = opts.display_mode;
        fetchStudents = this._fetchStudents(students);
        return fetchStudents.done((function(_this) {
          return function() {
            var studentModel;
            studentModel = studentsCollection.get(_this.student_id);
            return _this._showViews(studentModel);
          };
        })(this));
      };

      Controller.prototype._fetchStudents = function(students) {
        var studentModel;
        this.defer = $.Deferred();
        if (students instanceof Backbone.Collection) {
          studentsCollection = students;
          this.defer.resolve();
        } else {
          studentModel = App.request("get:user:by:id", this.student_id);
          App.execute("when:fetched", studentModel, (function(_this) {
            return function() {
              studentsCollection = App.request("get:students:by:division", studentModel.get('division'));
              return App.execute("when:fetched", studentsCollection, function() {
                return _this.defer.resolve();
              });
            };
          })(this));
        }
        return this.defer.promise();
      };

      Controller.prototype._showViews = function(studentModel) {
        this.layout = this._getStudentReportLayout(studentModel);
        this.show(this.layout, {
          loading: true
        });
        return this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            App.execute("show:student:filter:app", {
              region: _this.layout.studentFilterRegion,
              students: studentsCollection
            });
            return new StudentReportApp.QuizList.Controller({
              region: _this.layout.quizListRegion,
              student_id: studentModel.id
            });
          };
        })(this));
      };

      Controller.prototype._getStudentReportLayout = function(studentModel) {
        return new StudentReportApp.Layout({
          model: studentModel,
          display_mode: this.display_mode
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:student:report:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new StudentReportApp.Controller(opt);
    });
  });
});

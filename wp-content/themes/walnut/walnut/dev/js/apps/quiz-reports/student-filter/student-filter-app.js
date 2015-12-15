var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-filter/views'], function(App, RegionController) {
  return App.module("StudentsFilterApp", function(StudentsFilterApp, App, Backbone, Marionette, $, _) {
    StudentsFilterApp.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.students = opts.students;
        this.view = this._getStudentsFilterView();
        this.show(this.view, {
          loading: true
        });
        this.listenTo(this.region, "change:division", function(students) {
          this.students.reset(students.models);
          return this.show(this.view);
        });
        return this.listenTo(this.view, "view:student:report", function(student_id) {
          App.navigate("quiz-report/student/" + student_id);
          return App.execute("show:student:report:app", {
            region: App.mainContentRegion,
            students: this.students,
            student_id: student_id
          });
        });
      };

      Controller.prototype._getStudentsFilterView = function() {
        return new StudentsFilterApp.StudentsFilterView({
          students: this.students
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:student:filter:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new StudentsFilterApp.Controller(opt);
    });
  });
});

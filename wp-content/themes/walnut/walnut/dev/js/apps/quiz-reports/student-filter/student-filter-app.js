var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/quiz-reports/student-filter/views'], function(App, RegionController) {
  return App.module("StudentsFilterApp", function(StudentsFilterApp, App, Backbone, Marionette, $, _) {
    StudentsFilterApp.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        this.students = opts.students;
        this.view = this._getStudentsFilterView();
        this.show(this.view, {
          loading: true
        });
        return this.listenTo(this.region, "change:division", function(students) {
          this.students.reset(students.models);
          return this.show(this.view);
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/student-training-module/edit-module/module-edit-controller', 'apps/content-modules/modules-listing/app'], function(App) {
  return App.module("StudentTrainingApp", function(StudentTrainingApp, App) {
    var Controller, StudentTrainingRouter;
    StudentTrainingRouter = (function(_super) {
      __extends(StudentTrainingRouter, _super);

      function StudentTrainingRouter() {
        return StudentTrainingRouter.__super__.constructor.apply(this, arguments);
      }

      StudentTrainingRouter.prototype.appRoutes = {
        'add-student-training-module': 'addStudentModule',
        'view-student-training-module/:id': 'viewStudentModule',
        'edit-student-training-module/:id': 'editStudentModule',
        'view-student-training-modules': 'listStudentModules'
      };

      return StudentTrainingRouter;

    })(Marionette.AppRouter);
    Controller = {
      addStudentModule: function() {
        if ($.allowRoute('add-module')) {
          return App.execute('show:student:training:edit:module:controller', {
            region: App.mainContentRegion
          });
        }
      },
      editStudentModule: function(id) {},
      viewStudentModule: function(id) {},
      listStudentModules: function() {
        if ($.allowRoute('module-list')) {
          return App.execute("show:module:listing:app", {
            region: App.mainContentRegion,
            groupType: 'student-training'
          });
        }
      }
    };
    return StudentTrainingApp.on("start", function() {
      return new StudentTrainingRouter({
        controller: Controller
      });
    });
  });
});

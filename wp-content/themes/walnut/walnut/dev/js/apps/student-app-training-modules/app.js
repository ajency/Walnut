var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/student-training-module/view-module/single-module-controller', 'apps/student-app-training-modules/training-modules-controller'], function(App) {
  return App.module("StudentAppTrainingModules", function(StudentAppTrainingModules, App) {
    var Controller, StudentTrainingRouter;
    StudentTrainingRouter = (function(_super) {
      __extends(StudentTrainingRouter, _super);

      function StudentTrainingRouter() {
        return StudentTrainingRouter.__super__.constructor.apply(this, arguments);
      }

      StudentTrainingRouter.prototype.appRoutes = {
        'students/training-module/:id': 'viewStudentModule',
        'students/training-modules': 'listStudentModules'
      };

      return StudentTrainingRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewStudentModule: function(id) {
        var breadcrumb_items;
        this.studentTrainingModel = App.request("get:student:training:by:id", id);
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'View Student Training Module',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return App.execute("show:student:training:module", {
          region: App.mainContentRegion,
          model: this.studentTrainingModel
        });
      },
      listStudentModules: function() {
        if ($.allowRoute('quiz-list')) {
          return App.execute("show:student:app:training:modules", {
            region: App.mainContentRegion,
            groupType: 'student-training'
          });
        }
      }
    };
    return StudentAppTrainingModules.on("start", function() {
      return new StudentTrainingRouter({
        controller: Controller
      });
    });
  });
});

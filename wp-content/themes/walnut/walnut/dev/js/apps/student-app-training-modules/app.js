var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/student-training-module/view-module/single-module-controller', 'apps/student-app-training-modules/training-modules-controller'], function(App) {
  return App.module("StudentAppTrainingModules", function(StudentAppTrainingModules, App) {
    var Controller, StudentTrainingRouter;
    StudentTrainingRouter = (function(superClass) {
      extend(StudentTrainingRouter, superClass);

      function StudentTrainingRouter() {
        return StudentTrainingRouter.__super__.constructor.apply(this, arguments);
      }

      StudentTrainingRouter.prototype.appRoutes = {
        'students/training-module/:id': 'viewStudentModule',
        'students/training-modules/textbook/:tid': 'listStudentModules'
      };

      return StudentTrainingRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewStudentModule: function(id) {
        var breadcrumb_items;
        $("#header-region").hide();
        $("#left-nav-region").hide();
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
      listStudentModules: function(tid) {
        if ($.allowRoute('quiz-list')) {
          return App.execute("show:student:app:training:modules", {
            region: App.mainContentRegion,
            groupType: 'student-training',
            textbookID: tid
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

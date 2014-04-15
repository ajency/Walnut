var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/teachers-dashboard/dashboard/dashboard-controller', 'apps/teachers-dashboard/list-textbooks/list-textbooks-controller'], function(App) {
  return App.module("TeachersDashboardApp", function(TeachersDashboardApp, App) {
    var Controller, TeachersDashboardRouter;
    TeachersDashboardRouter = (function(_super) {
      __extends(TeachersDashboardRouter, _super);

      function TeachersDashboardRouter() {
        return TeachersDashboardRouter.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardRouter.prototype.appRoutes = {
        'teachers/dashboard': 'teachersDashboard',
        'teachers/take-class/:class_id-*div': 'takeClass',
        'teachers/start-training/:class_id': 'startTraining'
      };

      return TeachersDashboardRouter;

    })(Marionette.AppRouter);
    Controller = {
      teachersDashboard: function() {
        return new TeachersDashboardApp.View.DashboardController({
          region: App.mainContentRegion
        });
      },
      takeClass: function(class_id) {
        return this.chooseTextbooks('take-class', class_id);
      },
      startTraining: function(class_id, div) {
        return this.chooseTextbooks('start-training', class_id, div);
      },
      chooseTextbooks: function(str, class_id, div) {
        return new TeachersDashboardApp.View.TextbooksListController({
          region: App.mainContentRegion,
          classID: class_id,
          division: div
        });
      }
    };
    return TeachersDashboardApp.on("start", function() {
      return new TeachersDashboardRouter({
        controller: Controller
      });
    });
  });
});

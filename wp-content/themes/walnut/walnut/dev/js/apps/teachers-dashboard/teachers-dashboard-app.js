var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/teachers-dashboard/dashboard/dashboard-controller', 'apps/teachers-dashboard/start-training/start-training-controller', 'apps/teachers-dashboard/take-class/take-class-controller', 'apps/teachers-dashboard/textbook-modules/textbook-modules-controller'], function(App) {
  return App.module("TeachersDashboardApp", function(TeachersDashboardApp, App) {
    var Controller, TeachersDashboardRouter;
    TeachersDashboardRouter = (function(_super) {
      __extends(TeachersDashboardRouter, _super);

      function TeachersDashboardRouter() {
        return TeachersDashboardRouter.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardRouter.prototype.appRoutes = {
        'teachers/dashboard': 'teachersDashboard',
        'teachers/take-class/:classID/:div': 'takeClass',
        'teachers/start-training/:classID': 'startTraining',
        'teachers/take-class/:classID/:div/textbook/:tID': 'textbookModules'
      };

      return TeachersDashboardRouter;

    })(Marionette.AppRouter);
    Controller = {
      teachersDashboard: function() {
        return new TeachersDashboardApp.View.DashboardController({
          region: App.mainContentRegion
        });
      },
      takeClass: function(classID, div) {
        return new TeachersDashboardApp.View.TakeClassController({
          region: App.mainContentRegion,
          classID: classID,
          division: div
        });
      },
      startTraining: function(classID) {
        return new TeachersDashboardApp.View.StartTrainingController({
          region: App.mainContentRegion,
          classID: classID
        });
      },
      textbookModules: function(classID, div, tID) {
        return new TeachersDashboardApp.View.textbookModulesController({
          region: App.mainContentRegion,
          textbookID: tID
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

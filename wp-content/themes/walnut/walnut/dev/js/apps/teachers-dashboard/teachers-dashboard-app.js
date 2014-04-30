var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/teachers-dashboard/dashboard/dashboard-controller', 'apps/teachers-dashboard/take-class/take-class-controller', 'apps/teachers-dashboard/take-class/textbook-modules/textbook-modules-controller', 'apps/teachers-dashboard/start-training/start-training-controller', 'apps/teachers-dashboard/start-training/textbook-modules/textbook-modules-controller', 'apps/content-group/view-group/group-view-controller'], function(App) {
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
        'teachers/take-class/:classID/:div/textbook/:tID': 'takeClassTextbookModules',
        'teachers/start-training/:classID': 'startTraining',
        'teachers/start-training/:classID/textbook/:tID': 'startTrainingTextbookModules'
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
      takeClassTextbookModules: function(classID, div, tID) {
        return new TeachersDashboardApp.View.textbookModulesController({
          region: App.mainContentRegion,
          textbookID: tID,
          classID: classID,
          division: div
        });
      },
      takeSingleQuestion: function(classID, div, tID, mID, qID) {
        return new TeachersDashboardApp.SingleGroupApp.SingleQuestionController({
          region: App.mainContentRegion,
          textbookID: tID,
          classID: classID,
          division: div,
          moduleID: mID,
          questionID: qID
        });
      },
      startTraining: function(classID) {
        return new TeachersDashboardApp.View.StartTrainingController({
          region: App.mainContentRegion,
          classID: classID
        });
      },
      startTrainingTextbookModules: function(classID, tID) {
        return new TeachersDashboardApp.View.startTrainingTextbookModulesController({
          region: App.mainContentRegion,
          textbookID: tID,
          classID: classID
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

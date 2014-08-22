var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/students-dashboard/textbooks/take-class-controller'], function(App) {
  return App.module("TeachersDashboardApp", function(TeachersDashboardApp, App) {
    var Controller, TeachersDashboardRouter;
    TeachersDashboardRouter = (function(_super) {
      __extends(TeachersDashboardRouter, _super);

      function TeachersDashboardRouter() {
        return TeachersDashboardRouter.__super__.constructor.apply(this, arguments);
      }

      TeachersDashboardRouter.prototype.appRoutes = {
        'students/dashboard': 'studentsDashboard',
        'students/dashboard/textbook/:tID': 'studentsQuizModules'
      };

      return TeachersDashboardRouter;

    })(Marionette.AppRouter);
    Controller = {
      studentsDashboard: function() {
        var division;
        division = App.request("get:user:data", "division");
        return App.execute("show:take:class:textbooks:app", {
          region: App.mainContentRegion,
          division: division,
          mode: 'take-quiz'
        });
      },
      studentsQuizModules: function(tID) {
        var division;
        division = App.request("get:user:data", "division");
        return new TeachersDashboardApp.View.textbookModulesController({
          region: App.mainContentRegion,
          textbookID: tID,
          division: division,
          mode: 'take-quiz'
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

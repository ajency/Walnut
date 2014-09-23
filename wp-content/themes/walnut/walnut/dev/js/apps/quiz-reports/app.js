var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/quiz-reports/class-report/class-report-app'], function(App) {
  return App.module("QuizReportsApp", function(QuizReportsApp, App) {
    var Controller, QuizReportsRouter;
    QuizReportsRouter = (function(_super) {
      __extends(QuizReportsRouter, _super);

      function QuizReportsRouter() {
        return QuizReportsRouter.__super__.constructor.apply(this, arguments);
      }

      QuizReportsRouter.prototype.appRoutes = {
        'quiz-report': 'classReports'
      };

      return QuizReportsRouter;

    })(Marionette.AppRouter);
    Controller = {
      classReports: function() {
        return App.execute("show:class:report:app", {
          region: App.mainContentRegion
        });
      }
    };
    return QuizReportsApp.on("start", function() {
      return new QuizReportsRouter({
        controller: Controller
      });
    });
  });
});

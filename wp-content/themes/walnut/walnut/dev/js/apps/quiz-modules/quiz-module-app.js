var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/quiz-modules/view-single-quiz/single-quiz-controller'], function(App) {
  return App.module('QuizModuleApp', function(QuizModuleApp, App) {
    var Controller, QuizModuleRouter;
    QuizModuleRouter = (function(_super) {
      __extends(QuizModuleRouter, _super);

      function QuizModuleRouter() {
        return QuizModuleRouter.__super__.constructor.apply(this, arguments);
      }

      QuizModuleRouter.prototype.appRoutes = {
        'view-quiz/:id': 'viewQuiz'
      };

      return QuizModuleRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewQuiz: function(id) {
        return new QuizModuleApp.ViewQuiz.Controller({
          region: App.mainContentRegion,
          quiz_id: id
        });
      }
    };
    return QuizModuleApp.on('start', function() {
      return new QuizModuleRouter({
        controller: Controller
      });
    });
  });
});

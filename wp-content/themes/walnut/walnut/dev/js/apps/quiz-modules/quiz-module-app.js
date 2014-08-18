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
        'create-quiz': 'createQuiz',
        'edit-quiz/:id': 'editQuiz',
        'quiz-list': 'showQuizList',
        'view-quiz/:id': 'viewQuiz',
        'students/dashboard/textbook/:tID/quiz/:qID': 'startQuizClassMode'
      };

      return QuizModuleRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewQuiz: function(id) {
        return new QuizModuleApp.ViewQuiz.Controller({
          region: App.mainContentRegion,
          quiz_id: id
        });
      },
      startQuizClassMode: function(tID, qID) {
        return new QuizModuleApp.ViewQuiz.Controller({
          region: App.mainContentRegion,
          quiz_id: qID
        });
      },
      createQuiz: function() {
        return App.execute('show:edit:module:controller', {
          region: App.mainContentRegion,
          groupType: 'quiz'
        });
      },
      editQuiz: function(id) {
        return App.execute('show:edit:module:controller', {
          region: App.mainContentRegion,
          group_id: id,
          groupType: 'quiz'
        });
      },
      showQuizList: function() {
        return App.execute('show:module:listing:app', {
          region: App.mainContentRegion,
          groupType: 'quiz'
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

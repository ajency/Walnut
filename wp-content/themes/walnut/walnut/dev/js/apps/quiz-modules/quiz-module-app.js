var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/quiz-modules/view-single-quiz/single-quiz-controller'], function(App) {
  return App.module('QuizModuleApp', function(QuizModuleApp, App) {
    var Controller, QuizModuleRouter;
    QuizModuleRouter = (function(superClass) {
      extend(QuizModuleRouter, superClass);

      function QuizModuleRouter() {
        return QuizModuleRouter.__super__.constructor.apply(this, arguments);
      }

      QuizModuleRouter.prototype.appRoutes = {
        'create-quiz': 'createQuiz',
        'edit-quiz/:id': 'editQuiz',
        'quiz-list': 'showQuizList',
        'view-quiz/:id': 'viewQuiz',
        'students/dashboard/textbook/:tID/quiz/:qID': 'startQuizClassMode',
        'dummy-quiz/:content_piece_id': 'showDummyQuiz',
        'quiz-report/student/:sID/quiz/:qID': 'viewStudentsQuiz'
      };

      return QuizModuleRouter;

    })(Marionette.AppRouter);
    Controller = {
      viewQuiz: function(id) {
        if ($.allowRoute('view-quiz')) {
          return new QuizModuleApp.ViewQuiz.Controller({
            region: App.mainContentRegion,
            quiz_id: id
          });
        }
      },
      viewStudentsQuiz: function(student_id, quiz_id) {
        if ($.allowRoute('view-quiz')) {
          return new QuizModuleApp.ViewQuiz.Controller({
            region: App.mainContentRegion,
            quiz_id: quiz_id,
            student: student_id,
            d_mode: 'quiz_report'
          });
        }
      },
      startQuizClassMode: function(tID, qID) {
        if ($.allowRoute('view-quiz')) {
          return new QuizModuleApp.ViewQuiz.Controller({
            region: App.mainContentRegion,
            quiz_id: qID
          });
        }
      },
      createQuiz: function() {
        if ($.allowRoute('create-quiz')) {
          return App.execute('show:edit:module:controller', {
            region: App.mainContentRegion,
            groupType: 'quiz'
          });
        }
      },
      editQuiz: function(id) {
        if ($.allowRoute('edit-quiz')) {
          return App.execute('show:edit:module:controller', {
            region: App.mainContentRegion,
            group_id: id,
            groupType: 'quiz'
          });
        }
      },
      showQuizList: function() {
        if ($.allowRoute('quiz-list')) {
          return App.execute('show:module:listing:app', {
            region: App.mainContentRegion,
            groupType: 'quiz'
          });
        }
      },
      showDummyQuiz: function(content_piece_id) {
        var questionsCollection;
        if ($.allowRoute('dummy-quiz')) {
          this.contentPiece = App.request("get:content:piece:by:id", content_piece_id);
          questionsCollection = App.request("empty:content:pieces:collection");
          return App.execute("when:fetched", this.contentPiece, (function(_this) {
            return function() {
              var data, dummyQuizModel, quizResponseSummary, term_ids, textbookNames;
              questionsCollection.add(_this.contentPiece);
              dummyQuizModel = App.request("create:dummy:quiz:module", content_piece_id);
              term_ids = _this.contentPiece.get('term_ids');
              dummyQuizModel.set({
                'term_ids': term_ids
              });
              textbookNames = App.request("get:textbook:names:by:ids", term_ids);
              data = {
                'student_id': 5,
                'collection_id': 152
              };
              quizResponseSummary = App.request("create:quiz:response:summary", data);
              return App.execute("when:fetched", textbookNames, function() {
                return App.execute("start:take:quiz:app", {
                  region: App.mainContentRegion,
                  quizModel: dummyQuizModel,
                  quizResponseSummary: quizResponseSummary,
                  questionsCollection: questionsCollection,
                  display_mode: 'class-mode',
                  textbookNames: textbookNames
                });
              });
            };
          })(this));
        }
      }
    };
    return QuizModuleApp.on('start', function() {
      return new QuizModuleRouter({
        controller: Controller
      });
    });
  });
});

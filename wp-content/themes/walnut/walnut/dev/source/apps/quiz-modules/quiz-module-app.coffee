define ['app'
        'apps/quiz-modules/edit-quiz/edit-quiz-controller'
],(App)->
    App.module 'QuizModuleApp',(QuizModuleApp,App)->

        class QuizModuleRouter extends Marionette.AppRouter

            appRoutes :
                'create-quiz' : 'createQuiz'
                'edit-quiz/:id' : 'editQuiz'


        Controller =

            createQuiz : ->
                new QuizModuleApp.EditQuiz.Controller
                    region : App.mainContentRegion

            editQuiz : (id)->
                new QuizModuleApp.EditQuiz.Controller
                    region : App.mainContentRegion
                    quiz_id : id


        QuizModuleApp.on 'start',->
            new QuizModuleRouter
                controller : Controller


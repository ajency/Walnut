define ['app'
        'apps/quiz-modules/edit-quiz/edit-quiz-controller'
],(App)->
    App.module 'QuizModuleApp',(QuizModuleApp,App)->

        class QuizModuleRouter extends Marionette.AppRouter

            appRoutes :
                'create-quiz' : 'createQuiz'
                'edit-quiz/:id' : 'editQuiz'
                'quiz-list' : 'showQuizList'


        Controller =

            createQuiz : ->
                App.execute 'show:edit:module:controller',
                    region : App.mainContentRegion
                    groupType : 'quiz'

            editQuiz : (id)->
                App.execute 'show:edit:module:controller',
                    region : App.mainContentRegion
                    group_id : id
                    groupType : 'quiz'

            showQuizList : ->
                App.execute 'show:module:listing:app',
                    region: App.mainContentRegion
                    groupType : 'quiz'


        QuizModuleApp.on 'start',->
            new QuizModuleRouter
                controller : Controller


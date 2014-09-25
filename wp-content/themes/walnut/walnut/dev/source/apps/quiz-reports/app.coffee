define ['app'
        'apps/quiz-reports/class-report/class-report-app'
        'apps/quiz-reports/quiz-report/quiz-report-app'
], (App)->
    App.module "QuizReportsApp", (QuizReportsApp, App)->

        #startWithParent = false
        class QuizReportsRouter extends Marionette.AppRouter

            appRoutes:
                'quiz-report'                        : 'classReports'
                'quiz-report/div/:div/quiz/:quiz'    : 'quizReport'


        Controller =

            classReports: ->
                App.execute "show:class:report:app",
                    region: App.mainContentRegion

            quizReport:(div,quiz) ->
                App.execute "show:quiz:report:app",
                    region      : App.mainContentRegion
                    division    : div
                    quiz        : quiz


        QuizReportsApp.on "start", ->
            new QuizReportsRouter
                controller: Controller
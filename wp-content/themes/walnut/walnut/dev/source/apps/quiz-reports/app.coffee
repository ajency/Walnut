define ['app'
        'apps/quiz-reports/class-report/class-report-app'
], (App)->
    App.module "QuizReportsApp", (QuizReportsApp, App)->

        #startWithParent = false
        class QuizReportsRouter extends Marionette.AppRouter

            appRoutes:
                'quiz-report': 'classReports'


        Controller =

            classReports: ->
                App.execute "show:class:report:app",
                    region: App.mainContentRegion


        QuizReportsApp.on "start", ->
            new QuizReportsRouter
                controller: Controller
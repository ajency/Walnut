define ['app'
        'apps/students-dashboard/textbooks/take-class-controller'
        # 'apps/content-modules/view-single-module/single-module-controller'
], (App)->
    App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

        #startWithParent = false
        class TeachersDashboardRouter extends Marionette.AppRouter

            appRoutes:

                'students/dashboard': 'studentsDashboard'
                'students/dashboard/textbook/:tID': 'studentsQuizModules'

        Controller =

            studentsDashboard: ->

                division = App.request "get:user:data","division"

                App.execute "show:take:class:textbooks:app",
                    region: App.mainContentRegion,
                    division: division
                    mode        : 'take-quiz'


            studentsQuizModules: (tID) ->

                division = App.request "get:user:data","division"

                new TeachersDashboardApp.View.textbookModulesController
                    region      : App.mainContentRegion
                    textbookID  : tID
                    division    : division
                    mode        : 'take-quiz'

        TeachersDashboardApp.on "start", ->
            new TeachersDashboardRouter
                controller: Controller   
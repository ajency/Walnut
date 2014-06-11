define ['app'
        'apps/teachers-dashboard/dashboard/dashboard-controller'
        'apps/teachers-dashboard/take-class/take-class-controller'
        'apps/teachers-dashboard/take-class/textbook-modules/textbook-modules-controller'
        'apps/content-group/view-group/group-view-controller'
], (App)->
    App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

        #startWithParent = false
        class TeachersDashboardRouter extends Marionette.AppRouter

            appRoutes:
                'teachers/dashboard': 'teachersDashboard'
                'teachers/take-class/:classID/:div': 'takeClass'
                'teachers/take-class/:classID/:div/textbook/:tID': 'takeClassTextbookModules'
                'teachers/start-training/:classID': 'startTraining'
                'teachers/start-training/:classID/textbook/:tID': 'startTrainingTextbookModules'

        Controller =
            teachersDashboard: ->
                new TeachersDashboardApp.View.DashboardController
                    region: App.mainContentRegion

            takeClass: (classID, div) ->
                new TeachersDashboardApp.View.TakeClassController
                    region: App.mainContentRegion
                    classID: classID
                    division: div
                    mode: 'take-class'

            startTraining: (classID) ->
                new TeachersDashboardApp.View.TakeClassController
                    region: App.mainContentRegion
                    classID: classID
                    mode: 'training'

            takeClassTextbookModules: (classID, div, tID) ->
                new TeachersDashboardApp.View.textbookModulesController
                    region: App.mainContentRegion
                    textbookID: tID
                    classID: classID
                    division: div
                    mode: 'take-class'

            startTrainingTextbookModules: (classID, tID) ->
                new TeachersDashboardApp.View.textbookModulesController
                    region: App.mainContentRegion
                    textbookID: tID
                    classID: classID
                    mode: 'training'


        TeachersDashboardApp.on "start", ->
            new TeachersDashboardRouter
                controller: Controller

							
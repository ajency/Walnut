define ['app'
        'apps/teachers-dashboard/dashboard/dashboard-controller'
        'apps/teachers-dashboard/take-class/take-class-controller'
        'apps/teaching-modules/textbook-modules-controller'
        'apps/content-modules/view-single-module/single-module-controller'
], (App)->
    App.module "TeachersDashboardApp", (TeachersDashboardApp, App)->

        #startWithParent = false
        class TeachersDashboardRouter extends Marionette.AppRouter

            appRoutes:
                ''                                  : 'dashboardRedirect'
                'teachers/dashboard'                : 'teachersDashboard'
                'teachers/take-class/:classID/:div' : 'takeClass'
                'teachers/take-class/:classID/:div/textbook/:tID': 'takeClassTextbookModules'
                'teachers/start-training/:classID'  : 'startTraining'
                'teachers/start-training/:classID/textbook/:tID': 'startTrainingTextbookModules'

                'students/dashboard'                : 'studentsDashboard'
                'students/dashboard/textbook/:tID'  : 'studentsQuizModules'

        Controller =

            dashboardRedirect:->
                
                user = App.request "get:user:model"

                if $.allowRoute 'dashboard'
                    if user.current_user_can('administrator') or user.current_user_can('school-admin')
                        App.navigate('textbooks', trigger: true)

                    if user.current_user_can 'teacher'
                        App.navigate 'teachers/dashboard'
                        @teachersDashboard()  

                    if user.current_user_can 'student'
                        App.navigate 'students/dashboard'
                        @studentsDashboard()

            teachersDashboard: ->
                if $.allowRoute 'dashboard'
                    new TeachersDashboardApp.View.DashboardController
                        region: App.mainContentRegion

            takeClass: (classID, div) ->

                if $.allowRoute 'dashboard'
                    new TeachersDashboardApp.View.TakeClassController
                        region: App.mainContentRegion
                        classID: classID
                        division: div
                        mode: 'take-class'

            startTraining: (classID) ->
                if $.allowRoute 'dashboard'
                    new TeachersDashboardApp.View.TakeClassController
                        region      : App.mainContentRegion
                        classID     : classID
                        mode        : 'training'

            takeClassTextbookModules: (classID, div, tID) ->

                if $.allowRoute 'dashboard'
                    new TeachersDashboardApp.View.textbookModulesController
                        region      : App.mainContentRegion
                        textbookID  : tID
                        classID     : classID
                        division    : div
                        mode        : 'take-class'

            startTrainingTextbookModules: (classID, tID) ->

                if $.allowRoute 'dashboard'
                    new TeachersDashboardApp.View.textbookModulesController
                        region      : App.mainContentRegion
                        textbookID  : tID
                        classID     : classID
                        mode        : 'training'

            studentsDashboard: ->

                if $.allowRoute 'dashboard'
                    division = App.request "get:user:data","division"

                    App.execute "show:take:class:textbooks:app",
                        region: App.mainContentRegion,
                        division: division
                        mode        : 'take-quiz'


            studentsQuizModules: (tID) ->

                if $.allowRoute 'dashboard'

                    division = App.request "get:user:data","division"

                    new TeachersDashboardApp.View.textbookModulesController
                        region      : App.mainContentRegion
                        textbookID  : tID
                        division    : division
                        mode        : 'take-quiz'

        TeachersDashboardApp.on "start", ->
            new TeachersDashboardRouter
                controller: Controller

							
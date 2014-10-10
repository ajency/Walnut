define ['app'
    'controllers/region-controller'
    'apps/quiz-reports/student-filter/views'], (App, RegionController)->
    App.module "StudentsFilterApp", (StudentsFilterApp, App, Backbone, Marionette, $, _)->
        class StudentsFilterApp.Controller extends RegionController
            initialize:(opts) ->
                {@students} = opts
                
                @view=@_getStudentsFilterView()

                @show @view,
                    loading: true

                @listenTo @region, "change:division", (students)->
                    @students.reset students.models
                    @show @view

                @listenTo @view, "view:student:report", (student_id)->

                    App.navigate "quiz-report/student/#{student_id}"
                    
                    App.execute "show:student:report:app",
                        region      : App.mainContentRegion
                        students    : @students
                        student_id  : student_id

            _getStudentsFilterView:->
                new StudentsFilterApp.StudentsFilterView
                    students: @students

        # set handlers
        App.commands.setHandler "show:student:filter:app", (opt = {})->
            new StudentsFilterApp.Controller opt
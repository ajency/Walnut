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

            _getStudentsFilterView:->
                new StudentsFilterApp.StudentsFilterView
                    students: @students

        # set handlers
        App.commands.setHandler "show:student:filter:app", (opt = {})->
            new StudentsFilterApp.Controller opt
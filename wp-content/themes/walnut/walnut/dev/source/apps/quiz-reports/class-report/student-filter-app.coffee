define ['app'
        'controllers/region-controller'
], (App, RegionController)->
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
                new StudentsFilterView
                    students: @students

        class StudentsFilterView extends Marionette.ItemView

            template: '<div>Number of Students : {{totalStudents}} 
                        View quizzes taken by Student Name :
                        <select class="select-student">
                            {{#students}}
                                <option value="{{ID}}">{{display_name}}</option>
                            {{/students}}
                        </select> or Roll Number : 
                        <select class="select-student">
                            {{#students}}
                                <option value="{{ID}}">{{roll_no}}</option>
                            {{/students}}
                        </select>
                        <button class="btn btn-success">View Student</button>
                    </div>'

            events:
                'change .select-student' :(e)-> 
                    @$el.find '.select-student' 
                    .select2 'val', $(e.target).val() 

            mixinTemplateHelpers : (data)->
                data = super data
                data.totalStudents =_.size @students
                data.students = @students.toJSON()
                data

            initialize:->
                @students = Marionette.getOption @, 'students'

            onShow:->
                @$el.find 'select'
                .select2()


        # set handlers
        App.commands.setHandler "show:student:filter:app", (opt = {})->
            new StudentsFilterApp.Controller opt
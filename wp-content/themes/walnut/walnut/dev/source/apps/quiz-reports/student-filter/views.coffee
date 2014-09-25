define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "StudentsFilterApp", (StudentsFilterApp, App, Backbone, Marionette, $, _)->
        class StudentsFilterApp.StudentsFilterView extends Marionette.ItemView

            template: 'View quizzes taken by Student Name :
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
                data.students = @students.toJSON()
                data

            initialize:->
                @students = Marionette.getOption @, 'students'

            onShow:->
                @$el.find 'select'
                .select2()
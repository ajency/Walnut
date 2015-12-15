define ['app'
    'controllers/region-controller'], (App, RegionController)->

    App.module "StudentsFilterApp", (StudentsFilterApp, App, Backbone, Marionette, $, _)->
        class StudentsFilterApp.StudentsFilterView extends Marionette.ItemView

            template: '<span class="small">View quizzes taken by:</span>
                        <select id="student-name" class="textbook-filter select-student">
                            <option value="">-student name-</option>
                            {{#students}}
                                <option value="{{ID}}">{{display_name}}</option>
                            {{/students}}
                        </select> <span class="small">or:</span> 
                        <select class="textbook-filter select-student">
                            <option value="">-roll number-</option>
                            {{#students}}
                                <option value="{{ID}}">{{roll_no}}</option>
                            {{/students}}
                        </select>
                        <button class="btn btn-success btn-small view-student">View Student</button>
                    </div>'

            events:
                'change .select-student' :(e)-> 
                    @$el.find '.select-student' 
                    .select2 'val', $(e.target).val() 

                'click .view-student'   :->
                    stud_id= @$el.find("#student-name").val()
                    @trigger "view:student:report", stud_id if stud_id

            mixinTemplateHelpers : (data)->
                data = super data
                data.students = @students.toJSON()
                data

            initialize:->
                @students = Marionette.getOption @, 'students'

            onShow:->
                @$el.find 'select'
                .select2()
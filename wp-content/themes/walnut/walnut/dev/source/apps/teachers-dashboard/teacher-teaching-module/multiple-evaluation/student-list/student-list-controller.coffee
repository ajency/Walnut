define ['app'
        'controllers/region-controller'
        'apps/teachers-dashboard/teacher-teaching-module/multiple-evaluation/student-list/student-list-views'
],(App,RegionController)->
    App.module 'SingleQuestionMultipleEvaluationApp.StudentList',(StudentList,App)->
        class StudentList.Controller extends RegionController

            initialize :(options)->

                {@studentCollection,@questionResponseModel, @display_mode} = options

                @view = @_getStudentListView()

                @listenTo @view,  'student:selected' ,@studentSelected

                @show @view,
                    loading : true
                    entities : [
                        @studentCollection
                        @questionResponseModel
                    ]

            studentSelected : (id)->
                @region.trigger 'student:selected',id

            _getStudentListView:->
                new StudentList.Views.StudentsListView
                    collection : @studentCollection
                    correctAnswers: @questionResponseModel.get 'question_response'
                    display_mode: @display_mode
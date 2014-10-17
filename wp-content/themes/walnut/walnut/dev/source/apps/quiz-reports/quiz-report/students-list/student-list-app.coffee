define ['app'
        'controllers/region-controller'
        'apps/quiz-reports/quiz-report/students-list/composite-view'
        'apps/quiz-reports/attempts/attempts-app'
        ], (App, RegionController)->
    App.module "QuizReportApp.StudentsList", (StudentsList, App)->
        class StudentsList.Controller extends RegionController

            initialize : (opts)->

                {@students,@quizModel}= opts

                data=
                    'student_ids'   : @students.pluck 'ID'
                    'collection_id' : @quizModel.id 

                @quizResponseSummaries = App.request "get:quiz:response:summary", data

                App.execute "when:fetched", @quizResponseSummaries, =>

                    @quizResponseSummaries.remove @quizResponseSummaries.where 'status':'started'
                    
                    @view = view = @_getStudentsListView @students, @quizModel,@quizResponseSummaries

                    @show view

                    @listenTo @view, 'itemview:replay:quiz', @_replay_quiz

                    @listenTo @view, 'itemview:view:attempts', @_show_attempts_popup

            _show_attempts_popup:(itemview, student_id)=>

                App.execute "show:attempts:popup",
                    region      : App.dialogRegion
                    student     : @students.get student_id
                    quiz        : @quizModel
                    summaries   : @quizResponseSummaries

            _replay_quiz:(itemview,student_id,summary_id)->

                App.execute "show:single:quiz:app",
                    region                      : App.mainContentRegion
                    quizModel                   : @quizModel
                    quizResponseSummary         : @quizResponseSummaries.get summary_id
                    quizResponseSummaryCollection: @quizResponseSummaries
                    display_mode                : 'quiz_report'
                    student                     : @students.get student_id

            _getStudentsListView :(students,quizModel,summaries) ->

                new StudentsList.Views.StudentsDetailsView
                    collection              : students
                    quizModel               : quizModel
                    quizResponseSummaries   : summaries
define ['app'
    'controllers/region-controller'
    'apps/quiz-reports/quiz-report/quiz-report-layout'
    'apps/quiz-reports/quiz-report/quiz-details/quiz-details-app'
    'apps/quiz-reports/student-filter/student-filter-app'
    'apps/quiz-reports/quiz-report/students-list/student-list-app'], (App, RegionController)->

    App.module "QuizReportApp", (QuizReportApp, App)->
        class QuizReportApp.Controller extends RegionController
            
            initialize:(opts)->
                
                {division,quiz,@students} = opts

                @divisionModel = if division instanceof Backbone.Model 
                                    division 
                                else App.request "get:division:by:id", division

                @quizModel = if quiz instanceof Backbone.Model 
                                quiz
                            else App.request "get:quiz:by:id", quiz

                

                App.execute "when:fetched", [@divisionModel,@quizModel], =>

                    if @students instanceof Backbone.Collection
                        @_showViews @students

                    else
                        @students= App.request "get:students:by:division", @divisionModel.id

                        App.execute "when:fetched", @students, => @_showViews @students

            _showViews:(students)=>

                data=
                    'student_ids'   : @students.pluck 'ID'
                    'collection_id' : @quizModel.id 

                @quizResponseSummaries = App.request "get:quiz:response:summary", data

                App.execute "when:fetched", @quizResponseSummaries, =>

                    @quizResponseSummaries.remove @quizResponseSummaries.where 'status':'started'

                    takenBy = _.size _.uniq @quizResponseSummaries.pluck 'student_id'

                    @layout = @_getQuizReportLayout students,takenBy
                            
                    @show @layout,
                        loading: true

                    @listenTo @layout, "show",=>
                        App.execute "show:student:filter:app",
                            region: @layout.studentFilterRegion
                            students: students

                        textbook_termIDs = _.flatten @quizModel.get 'term_ids'

                        @textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

                        App.execute "when:fetched", @textbookNames, =>
                            new QuizReportApp.QuizDetails.Controller
                                region: @layout.quizDetailsRegion
                                model : @quizModel
                                textbookNames: @textbookNames
                                divisionModel : @divisionModel

                        new QuizReportApp.StudentsList.Controller
                            region      : @layout.studentsListRegion
                            students    : students
                            quizModel   : @quizModel
                            quizResponseSummaries : @quizResponseSummaries

            _getQuizReportLayout:(students,takenBy)->
                new QuizReportApp.Layout.QuizReportLayout
                    students : students
                    takenBy  : takenBy

        # set handlers
        App.commands.setHandler "show:quiz:report:app", (opt = {})->
            new QuizReportApp.Controller opt    




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

                @layout = @_getQuizReportLayout students
                        
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

                @listenTo @layout.filtersRegion, "division:changed",(division)=>
                    students = App.request "get:students:by:division", division
                    App.execute "when:fetched", students, =>
                        @layout.studentFilterRegion.trigger 'change:division', students


            _getQuizReportLayout:(students)->
                new QuizReportApp.Layout.QuizReportLayout
                    students : students

        # set handlers
        App.commands.setHandler "show:quiz:report:app", (opt = {})->
            new QuizReportApp.Controller opt    




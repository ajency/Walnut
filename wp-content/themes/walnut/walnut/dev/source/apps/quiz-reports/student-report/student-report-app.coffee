define ['app'
    'controllers/region-controller'
    'apps/quiz-reports/student-report/student-report-layout'
    'apps/quiz-reports/student-filter/student-filter-app'
    'apps/quiz-reports/student-report/quiz-list/quiz-list-app'], (App, RegionController)->

    App.module "StudentReportApp", (StudentReportApp, App)->
        class StudentReportApp.Controller extends RegionController
            
            studentsCollection =null

            initialize:(opts)->

                {students,@student_id, @display_mode} = opts

                #get the header and left nav back incase it was hidden for quiz view
                $.showHeaderAndLeftNav()
                
                fetchStudents = @_fetchStudents students                

                fetchStudents.done =>
                    studentModel = studentsCollection.get @student_id
                    @_showViews studentModel

            _fetchStudents:(students)->

                @defer = $.Deferred()

                if students instanceof Backbone.Collection 
                    studentsCollection = students
                    @defer.resolve()
                
                else 
                    studentModel= App.request "get:user:by:id", @student_id
                    App.execute "when:fetched", studentModel, =>
                        studentsCollection = App.request "get:students:by:division", studentModel.get 'division'
                        App.execute "when:fetched", studentsCollection, =>  @defer.resolve()

                @defer.promise()

            _showViews:(studentModel)=>

                @layout = @_getStudentReportLayout studentModel
                        
                @show @layout,
                    loading: true

                @listenTo @layout, "show",=>
                    App.execute "show:student:filter:app",
                        region: @layout.studentFilterRegion
                        students: studentsCollection

                    new StudentReportApp.QuizList.Controller
                        region: @layout.quizListRegion
                        student_id : studentModel.id

            _getStudentReportLayout:(studentModel)->
                new StudentReportApp.Layout
                    model           : studentModel
                    display_mode    : @display_mode


        # set handlers
        App.commands.setHandler "show:student:report:app", (opt = {})->
            new StudentReportApp.Controller opt    
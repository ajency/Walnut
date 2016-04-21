define ['app'
    'controllers/region-controller'
    'apps/quiz-reports/class-report/class-report-layout'
    'apps/quiz-reports/class-report/modules-listing/controller'
    'apps/quiz-reports/student-filter/student-filter-app'
    'apps/quiz-reports/class-report/search-results-app'
    'apps/quiz-reports/class-report/schedule-quiz-app'
    'apps/quiz-reports/class-report/recipients-popup/controller'], (App, RegionController)->

    App.module "ClassReportApp", (ClassReportApp, App)->
        class ClassReportApp.Controller extends RegionController

            students = null
            textbooksCollection = null
            divisionsCollection = null
            schoolsCollection   = null
            quizzes = null

            initialize: ->

                @division = 0

                schoolsCollection   = App.request "get:all:schools"
                App.execute "when:fetched", schoolsCollection, @_fetchDivisions                        

            _fetchDivisions:=>
                
                divisionsCollection = App.request "get:divisions"
                App.execute "when:fetched", divisionsCollection, @_fetchTextbooks  

            _fetchTextbooks:=>
                
                class_id= divisionsCollection.first().get 'class_id'
                division= divisionsCollection.first().get 'id'

                textbooksCollection = App.request "get:textbooks", 'class_id' : class_id

                App.execute "when:fetched", textbooksCollection, => 
                App.execute "when:fetched", textbooksCollection, @_fetchQuizzes

            _fetchQuizzes:=>

                textbook = textbooksCollection.first()
                @division= divisionsCollection.first().get 'id'
                
                data = 
                    'textbook'      : textbook.id
                    'division'      : @division

                quizzes = App.request "get:quizes", data

                students = App.request "get:students:by:division", divisionsCollection.first().get 'id'
                App.execute "when:fetched", [quizzes,students], @_showViews 

            _showViews:=>
                #wreqr object to get the selected filter parameters so that search can be done using them
                @selectedFilterParamsObject = new Backbone.Wreqr.RequestResponse()

                @layout = @_getContentPiecesLayout()

                App.execute "when:fetched", students, =>
                    @show @layout,
                        loading: true

                @listenTo @layout, "show", =>
                    App.execute "show:textbook:filters:app",
                        region: @layout.filtersRegion
                        collection: quizzes
                        textbooksCollection: textbooksCollection
                        selectedFilterParamsObject: @selectedFilterParamsObject
                        divisionsCollection : divisionsCollection
                        dataType : 'quiz'
                        filters : ['divisions','textbooks', 'chapters','post_status']

                        

                        App.execute "when:fetched", students, =>
                            App.execute "show:student:filter:app",
                                region: @layout.studentFilterRegion
                                students: students

                            App.execute "show:list:quiz:report:app",
                                region: @layout.allContentRegion
                                contentModulesCollection: quizzes
                                textbooksCollection: textbooksCollection

                            new ClassReportApp.SearchResults.Controller
                                region: @layout.searchResultsRegion
                                textbooksCollection: textbooksCollection
                                selectedFilterParamsObject: @selectedFilterParamsObject

                    @listenTo @layout.filtersRegion, "update:pager",=> @layout.allContentRegion.trigger "update:pager"
                    
                    @listenTo @layout.filtersRegion, "division:changed",(division)=>
                        @division = division
                        students = App.request "get:students:by:division", division
                        App.execute "when:fetched", students, =>
                            @layout.studentFilterRegion.trigger 'change:division', students
                            @layout.triggerMethod 'change:division', students

                    @listenTo @layout.allContentRegion, "show:quiz:report", @_showQuiz
                    @listenTo @layout.searchResultsRegion, "show:quiz:report", @_showQuiz

                    @listenTo @layout.allContentRegion, "save:communications", (data)=>
                            data=
                                component           : 'quiz'
                                communication_type  : 'quiz_completed_parent_mail'
                                communication_mode  : data.communication_mode
                                additional_data:
                                    quiz_ids        : data.quizIDs
                                    division        : @division
                            #console.log @division
                            communicationModel = App.request "create:communication",data
                            @_showSelectRecipientsApp communicationModel
                            

                    @listenTo @layout.allContentRegion, "schedule:quiz", @_showScheduleQuizApp

                    @listenTo @layout.allContentRegion, "clear:schedule", (quizModel)=>   
                        
                        clearSchedule = App.request "clear:quiz:schedule", quizModel.id, @division

                        clearSchedule.done (response)->
                            if response.code is 'OK'
                                quizModel.set
                                    'schedule': false

            _showScheduleQuizApp:(quizModel)->
                App.execute "show:schedule:quiz:popup",
                    region      : App.dialogRegion
                    division    : @division
                    quizModel   : quizModel

            _showSelectRecipientsApp:(communicationModel)->
                App.execute "show:quiz:select:recipients:popup",
                    region               : App.dialogRegion
                    communicationModel   : communicationModel

            _showQuiz:(quizModel)->
                App.navigate "quiz-report/div/#{@division}/quiz/#{quizModel.id}"
                
                App.execute "show:quiz:report:app",
                    region      : App.mainContentRegion
                    division    : divisionsCollection.get @division
                    students    : students
                    quiz        : quizModel

            _getContentPiecesLayout:->
                new ClassReportApp.Layout.ContentPiecesLayout
                    students : students

        # set handlers
        App.commands.setHandler "show:class:report:app", (opt = {})->
            new ClassReportApp.Controller opt    
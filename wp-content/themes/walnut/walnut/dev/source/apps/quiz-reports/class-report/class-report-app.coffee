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
            divisionsSelectCollection = null
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
                if(window.division_id)
                    divisionsSelectCollection = App.request "get:division:by:id", window.division_id
                    App.execute "when:fetched", divisionsSelectCollection, =>
                        class_id= divisionsSelectCollection.get 'class_id'
                        division= divisionsSelectCollection.get 'id'

                        textbooksCollection = App.request "get:textbooks", 'class_id' : class_id
                        
                        App.execute "when:fetched", textbooksCollection, => 
                        App.execute "when:fetched", textbooksCollection, @_fetchQuizzes
                else
                    class_id= divisionsCollection.first().get 'class_id'
                    division= divisionsCollection.first().get 'id'

                    textbooksCollection = App.request "get:textbooks", 'class_id' : class_id

                    App.execute "when:fetched", textbooksCollection, => 
                    App.execute "when:fetched", textbooksCollection, @_fetchQuizzes

            _fetchQuizzes:=>
                if(window.division_id)
                    textbook = textbooksCollection.first()
                    @division= divisionsSelectCollection.get 'id'

                    data = 
                        'textbook'      : window.textbook_ids
                        'division'      : @division
                        'post_status'   : quiz_report_status
                else
                    textbook = textbooksCollection.first()
                    @division= divisionsCollection.first().get 'id'

                    data = 
                        'textbook'      : textbook.id
                        'division'      : @division
                
                #console.log data
                quizzes = App.request "get:quizes", data

                if(window.division_id)
                    students = App.request "get:students:by:division", divisionsSelectCollection.get 'id'
                else
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
                        filters : ['divisions','multi_textbooks','post_status_report']

                        

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

                    # to send summary email
                    @listenTo @layout.allContentRegion, "summary:communication", (data)=>
                            #console.log "communictaion"
                            data=
                                component           : 'quiz'
                                communication_type  : 'quiz_summary_parent_mail'
                                communication_mode  : data.communication_mode
                                additional_data:
                                    quiz_ids        : data.quizIDs
                                    division        : @division
                                    start_date      : data.start_date
                                    end_date        : data.end_date
                            communicationModel = App.request "create:communication",data
                            @_showSelectRecipientsApp communicationModel

                    @listenTo @layout.allContentRegion, "excel:generation", (data)=>
                        optn = data.options
                        quiz_model = optn.model

                        window.open(AJAXURL+ '?action=generate-xl-report&data='+quiz_model.id+'&division='+@division)
                        # options =
                        #     type : 'GET'
                        #     url : AJAXURL+ '?action=generate-xl-report&data='+quiz_model.id+'&division='+@division

                        # $.ajax(options).done (response)->
                        #         console.log response
                        #         #window.open(response);
                        #         # contentPieceModel.set 'ID' : response.ID

                        #         # $ ".page-title"
                        #         # .before '<div id="saved-successfully" style="text-align:center;" class="alert alert-success">Content Piece Saved Successfully</div>'
                                
                        #         # setTimeout -> 
                        #         #     $('#saved-successfully').remove()
                        #         # , 3000

                        #     .fail (resp)->
                        #             console.log 'error'
                            

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
                window.division_id = @division
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
define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app'
        'apps/quiz-modules/view-single-quiz/content-display/content-display-app'
        'apps/quiz-modules/take-quiz-module/take-quiz-app'
], (App, RegionController)->
    App.module "QuizModuleApp.ViewQuiz", (ViewQuiz, App)->
        class ViewQuiz.Controller extends RegionController

            quizModel = null
            questionsCollection = null
            quizResponseSummary = null
            display_mode = null

            initialize: (opts) ->

                {quiz_id,quizModel,questionsCollection,@questionResponseCollection,quizResponseSummary} = opts

                quizModel = App.request "get:quiz:by:id", quiz_id if not quizModel

                App.execute "show:headerapp", region : App.headerRegion
                App.execute "show:leftnavapp", region : App.leftNavRegion

                @fetchQuizResponseSummary = @_fetchQuizResponseSummary()
                console.log @questionResponseCollection
                fetchQuestionResponseCollection = @_fetchQuestionResponseCollection()

                fetchQuestionResponseCollection.done =>
                    App.execute "when:fetched", quizModel, =>

                        display_mode = 'class_mode'

                        if quizResponseSummary.get('status') is 'started'
                            display_mode = 'class_mode'

                        if quizResponseSummary.get('status') is 'completed'
                            display_mode = 'replay'


                        textbook_termIDs = _.flatten quizModel.get 'term_ids'
                        @textbookNames = App.request "get:textbook:names:by:ids", textbook_termIDs

                        if not questionsCollection
                            questionsCollection = App.request "get:content:pieces:by:ids", quizModel.get 'content_pieces'

                            App.execute "when:fetched", questionsCollection, ->
                                if quizModel.get('permissions').randomize
                                    questionsCollection.each (e)-> e.unset 'order'
                                    questionsCollection.reset questionsCollection.shuffle()
                        
                        App.execute "when:fetched", [questionsCollection,@textbookNames],  =>
                            @layout = layout = @_getQuizViewLayout()

                            @show @layout, loading: true

                            @listenTo @layout, 'show', @showQuizViews

                            @listenTo @layout.quizDetailsRegion, 'start:quiz:module', @startQuiz

            _fetchQuizResponseSummary:->
                defer = $.Deferred();

                #if the summary has been passed from the take-quiz-module app after quiz completion
                if quizResponseSummary
                    defer.resolve()
                    return defer.promise()

                @summary_data= 
                    'collection_id' : quizModel.get 'id'
                    'student_id'    : App.request "get:loggedin:user:id"

                quizResponseSummaryCollection = App.request "get:quiz:response:summary", @summary_data
                App.execute "when:fetched", quizResponseSummaryCollection, =>

                    if quizResponseSummaryCollection.length>0
                        quizResponseSummary= quizResponseSummaryCollection.first()
                        defer.resolve()

                    else
                        quizResponseSummary =  App.request "create:quiz:response:summary", @summary_data
                        defer.resolve()
                        
                defer.promise()

            _fetchQuestionResponseCollection:=>
                defer = $.Deferred();

                @fetchQuizResponseSummary.done =>
                    if not @questionResponseCollection and not quizResponseSummary.isNew()
                        @questionResponseCollection = App.request "get:quiz:question:response:collection",
                            'summary_id': quizResponseSummary.get 'summary_id'

                        App.execute "when:fetched", @questionResponseCollection, =>
                            defer.resolve()
                    else
                        defer.resolve()

                
                defer.promise()

            startQuiz: =>

                App.execute "start:take:quiz:app",
                    region: App.mainContentRegion
                    quizModel               : quizModel
                    quizResponseSummary     : quizResponseSummary
                    questionsCollection     : questionsCollection
                    display_mode            : display_mode
                    questionResponseCollection: @questionResponseCollection
                    textbookNames           : @textbookNames

            showQuizViews: =>

                App.execute "show:view:quiz:detailsapp",
                    region                  : @layout.quizDetailsRegion
                    model                   : quizModel
                    display_mode            : display_mode
                    quizResponseSummary     : quizResponseSummary
                    textbookNames           : @textbookNames

                if quizResponseSummary.get('status') is 'completed'
                    
                    App.execute "show:quiz:items:app",
                        region                  : @layout.contentDisplayRegion
                        model                   : quizModel
                        groupContentCollection  : questionsCollection
                        questionResponseCollection: @questionResponseCollection

            _getQuizViewLayout: =>
                new QuizViewLayout


        class QuizViewLayout extends Marionette.Layout

            template: '<div class="teacher-app">
                          <div id="quiz-details-region"></div>
                        </div>
                        <div id="content-display-region"></div>'

            regions:
                quizDetailsRegion: '#quiz-details-region'
                contentDisplayRegion: '#content-display-region'

            onShow:->
                $('.page-content').removeClass 'expand-page'


        # set handlers
        App.commands.setHandler "show:single:quiz:app", (opt = {})->
            new ViewQuiz.Controller opt

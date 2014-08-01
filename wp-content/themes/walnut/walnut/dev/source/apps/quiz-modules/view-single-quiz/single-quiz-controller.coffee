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
            questionResponseCollection = null
            display_mode = null

            initialize: (opts) ->

                {quiz_id,quizModel,questionsCollection,questionResponseCollection} = opts

                quizModel = App.request "get:quiz:by:id", quiz_id if not quizModel

                App.execute "show:headerapp", region : App.headerRegion
                App.execute "show:leftnavapp", region : App.leftNavRegion

                if not questionResponseCollection
                    questionResponseCollection = App.request "get:quiz:response:collection",
                        'collection_id': quizModel.get 'id'
                
                App.execute "when:fetched", [quizModel,questionResponseCollection], =>

                    if questionResponseCollection.length>0
                        display_mode = 'replay'

                    if questionResponseCollection.length>0 and quizModel.hasPermission 'disable_quiz_replay'
                        display_mode = 'disable_quiz_replay'

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

            startQuiz: =>
                
                App.execute "start:take:quiz:app",
                    region: App.mainContentRegion
                    quizModel               : quizModel
                    questionsCollection     : questionsCollection
                    display_mode            : display_mode
                    questionResponseCollection: questionResponseCollection
                    textbookNames           : @textbookNames

            showQuizViews: =>

                App.execute "show:view:quiz:detailsapp",
                    region      : @layout.quizDetailsRegion
                    model       : quizModel
                    display_mode: display_mode
                    textbookNames: @textbookNames

                if _.size(quizModel.get('content_pieces')) > 0 and not questionResponseCollection.isEmpty()
                    
                    App.execute "show:quiz:items:app",
                        region                  : @layout.contentDisplayRegion
                        model                   : quizModel
                        groupContentCollection  : questionsCollection
                        questionResponseCollection: questionResponseCollection

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

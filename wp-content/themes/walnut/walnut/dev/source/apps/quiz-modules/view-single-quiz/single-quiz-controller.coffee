define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/quiz-description/quiz-description-app'
        'apps/quiz-modules/view-single-quiz/content-display/content-display-app'
        'apps/quiz-modules/take-quiz-module/take-quiz-app'
], (App, RegionController)->
    App.module "QuizModuleApp.View", (View, App)->
        class View.QuizController extends RegionController

            quizModel = null
            questionsCollection = null

            initialize: (opts) ->

                {quiz_id,quizModel,questionsCollection} = opts

                quizModel = App.request "get:quiz:by:id", quiz_id if not quizModel

                App.execute "show:headerapp", region : App.headerRegion
                App.execute "show:leftnavapp", region : App.leftNavRegion

                @questionResponseCollection = App.request "get:quiz:response:collection",
                    'collection_id': quizModel.get 'id'

                App.execute "when:fetched", quizModel, =>
                    
                    if not questionsCollection
                        questionsCollection = App.request "get:content:pieces:by:ids", quizModel.get 'content_pieces'
                    
                    App.execute "when:fetched", questionsCollection, =>
                        @layout = layout = @_getQuizViewLayout()

                        @show @layout, loading: true

                        @listenTo @layout, 'show', @showQuizViews

                        @listenTo @layout.quizDetailsRegion, 'start:quiz:module', @startQuiz

            startQuiz: =>
                
                App.execute "start:take:quiz:app",
                    region: App.mainContentRegion
                    quizModel: quizModel
                    questionsCollection: questionsCollection
                    display_mode: 'quiz_mode' 
                    questionResponseCollection: @questionResponseCollection

                    # when display mode is readonly, the save response options are not shown
                    # only when display mode is class_mode response changes can be done

            showQuizViews: =>

                App.execute "show:view:quiz:detailsapp",
                    region: @layout.quizDetailsRegion
                    model: quizModel

                # if _.size(@quizModel.get('content_pieces')) > 0
                #     App.execute "show:viewgroup:content:displayapp",
                #         region: @layout.contentDisplayRegion
                #         model: model
                #         groupContentCollection: groupContentCollection

            _getQuizViewLayout: =>
                new QuizViewLayout


        class QuizViewLayout extends Marionette.Layout

            template: '<div class="teacher-app">
                          <div id="quiz-details-region"></div>
                        </div>
                        <div id="content-display-region"></div>'

            className: ''

            regions:
                quizDetailsRegion: '#quiz-details-region'
                contentDisplayRegion: '#content-display-region'

            onShow:->
                $('.page-content').removeClass 'expand-page'


        # set handlers
        App.commands.setHandler "show:single:quiz:app", (opt = {})->
            new View.QuizController opt

define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/edit-quiz-view'
        'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller'
],(App,RegionController)->
    App.module 'QuizModuleApp.EditQuiz',(EditQuiz,App)->

        class EditQuiz.Controller extends RegionController

            initialize : (options) ->
                {@quiz_id}= options

                if @quiz_id
                    @quizModel = App.request "get:quiz:by:id", @quiz_id
                else
                    @quizModel = App.request "new:quiz"

                App.execute "when:fetched", @quizModel, =>
                    @showQuizEditView()

            showQuizEditView : ->

                @layout = @_getQuizEditLayout()


                @listenTo @layout, 'show', =>
                    @showQuizDetailsViews()

#                    if @quiz_id
#                        @_showContentSelectionApp @contentGroupModel

#                @listenTo @quizModel, 'change:id', @_showContentSelectionApp, @

#                @listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
#                    console.log 'close:content:selection:app '
#                    @layout.contentSelectionRegion.close()

                @show @layout, (loading : true)

            _getQuizEditLayout : ->
                new EditQuiz.Views.EditQuizLayout

            showQuizDetailsViews : ->
                App.execute "show:edit:quiz:details",
                    region : @layout.quizDetailsRegion
                    model : @quizModel


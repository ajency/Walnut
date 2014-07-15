define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/edit-quiz-view'
        'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller'
        'apps/quiz-modules/edit-quiz/content-selection/content-selection-controller'
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
                    @_showQuizDetailsViews()

                    if @quiz_id
                        @_showContentSelectionApp @quizModel

#                @listenTo @quizModel, 'change:id', @_showContentSelectionApp, @

#                @listenTo @layout.collectionDetailsRegion, 'close:content:selection:app', =>
#                    console.log 'close:content:selection:app '
#                    @layout.contentSelectionRegion.close()

                @show @layout, (loading : true)

            _getQuizEditLayout : ->
                new EditQuiz.Views.EditQuizLayout

            _showQuizDetailsViews : ->
                App.execute "show:edit:quiz:details",
                    region : @layout.quizDetailsRegion
                    model : @quizModel

            _showContentSelectionApp : (model)=>
                @quizContentCollection = new Backbone.Collection

                App.execute "when:fetched", @quizContentCollection, =>
                    if model.get('post_status') is 'underreview'
                        App.execute "show:content:selectionapp",
                            region : @layout.contentSelectionRegion
                            model : model
                            quizContentCollection : @quizContentCollection

#                    App.execute "show:editgroup:content:displayapp",
#                        region : @layout.contentDisplayRegion
#                        model : model
#                        contentGroupCollection : @contentGroupCollection


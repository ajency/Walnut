define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/edit-quiz-view'
        'apps/quiz-modules/edit-quiz/quiz-description/quiz-description-controller'
        'apps/quiz-modules/edit-quiz/content-selection/content-selection-controller'
        'apps/quiz-modules/edit-quiz/quiz-content-display/quiz-content-display-controller'
],(App,RegionController)->
    App.module 'QuizModuleApp.EditQuiz',(EditQuiz,App)->

        class EditQuiz.Controller extends RegionController

            initialize : (options) ->
                {@quiz_id}= options

                if @quiz_id
                    @quizModel = App.request "get:quiz:by:id", @quiz_id
                else
                    @quizModel = App.request "new:quiz"

                @textbooksCollection = App.request "get:textbooks"

                App.execute "when:fetched", [@quizModel,@textbooksCollection], =>
                    @showQuizEditView()

            showQuizEditView : ->

                @layout = @_getQuizEditLayout()


                @listenTo @layout, 'show', =>
                    @_showQuizDetailsViews()

                    if @quiz_id
                        @_showContentSelectionApp @quizModel

                @listenTo @quizModel, 'change:id', @_showContentSelectionApp, @

                @listenTo @layout.quizDetailsRegion, 'close:content:selection:app', =>
#                    console.log 'close:content:selection:app '
                    @layout.contentSelectionRegion.close()

                @show @layout, (loading : true)

            _getQuizEditLayout : ->
                new EditQuiz.Views.EditQuizLayout

            _showQuizDetailsViews : ->
                App.execute "show:edit:quiz:details",
                    region : @layout.quizDetailsRegion
                    model : @quizModel
                    textbooksCollection : @textbooksCollection

            _showContentSelectionApp : (model)=>
                @quizContentCollection = new Backbone.Collection
                _.each model.get('content_layout'),(content)=>
                    if content.type is 'content-piece'
                        contentModel = App.request "get:content:piece:by:id",content.id
                    else
                        content.data.lvl1 = parseInt content.data.lvl1
                        content.data.lvl2 = parseInt content.data.lvl2
                        content.data.lvl3 = parseInt content.data.lvl3
                        contentModel = new Backbone.Model content.data
                    @quizContentCollection.add contentModel

                App.execute "when:fetched", @quizContentCollection, =>
                    if model.get('post_status') is 'underreview'
                        App.execute "show:quiz:content:selection:app",
                            region : @layout.contentSelectionRegion
                            model : model
                            quizContentCollection : @quizContentCollection
                            textbooksCollection : @textbooksCollection

                    App.execute "show:quiz:content:display:app",
                        region : @layout.contentDisplayRegion
                        model : model
                        quizContentCollection : @quizContentCollection


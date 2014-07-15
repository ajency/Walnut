define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/content-selection/content-selection-views'
],(App,RegionController)->
    App.module 'QuizModuleApp.EditQuiz.ContentSelection',(ContentSelection,App)->
        class ContentSelection.Controller extends  RegionController

            initialize : (options)->

                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces",
                    post_status: 'publish'
                    content_type: ['student_question']

                {@model,@quizContentCollection} = options

                App.execute "when:fetched", [@contentPiecesCollection, @quizContentCollection, @textbooksCollection], =>
                    @contentPiecesCollection.remove model for model in @quizContentCollection.models
                    @view = @_getContentSelectionView()

                    @listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
                        chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
                        App.execute "when:fetched", chaptersOrSections, =>
                            @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType


                    @show @view,
                        loading: true

            _getContentSelectionView: (collection)=>
                new ContentSelection.Views.DataContentTableView
                    collection: @contentPiecesCollection
                    fullCollection : @contentPiecesCollection.clone()
                    quizModel : @model
                    textbooksCollection : @textbooksCollection




        # set handlers
        App.commands.setHandler "show:content:selectionapp", (options = {})->
            new ContentSelection.Controller options
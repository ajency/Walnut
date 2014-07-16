define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/content-selection/content-selection-views'
], (App, RegionController)->
    App.module 'QuizModuleApp.EditQuiz.QuizContentSelection', (QuizContentSelection, App)->
        class QuizContentSelection.Controller extends  RegionController

            initialize : (options)->
                @textbooksCollection = App.request "get:textbooks"
                @contentPiecesCollection = App.request "get:content:pieces",
                    post_status : 'publish'
                    content_type : ['student_question']

                {@model,@quizContentCollection} = options

                App.execute "when:fetched", [@contentPiecesCollection, @quizContentCollection, @textbooksCollection], =>
                    @contentPiecesCollection.remove model for model in @quizContentCollection.models
                    @view = @_getContentSelectionView()

                    @listenTo @view, "fetch:chapters:or:sections", @_fetchSectionOrSubsection

                    @listenTo @view, "add:content:pieces", @_addContentPieces

                    @listenTo @view, 'add:new:set', @_addNewSet

                    @listenTo @quizContentCollection, 'remove',@quizContentRemoved

                    @show @view,
                        loading : true

            _fetchSectionOrSubsection : (parentID, filterType, currItem) =>
                chaptersOrSections = App.request "get:chapters", ('parent' : parentID)
                console.log chaptersOrSections
                App.execute "when:fetched", chaptersOrSections, =>
                    @view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections, filterType, currItem


            _getContentSelectionView : (collection)=>
                new QuizContentSelection.Views.DataContentTableView
                    collection : @contentPiecesCollection
                    fullCollection : @contentPiecesCollection.clone()
                    quizModel : @model
                    textbooksCollection : @textbooksCollection

            _addContentPieces : (contentIDs) =>
                _.each contentIDs, (ele, index)=>
                    @quizContentCollection.add @contentPiecesCollection.get ele
#                    @contentPiecesCollection.remove ele
                @contentPiecesCollection.remove(id) for id in contentIDs


                console.log @quizContentCollection


            _addNewSet : (data)=>
                data.id = @_getNewSetId()

                newSetModel = new Backbone.Model data

                @quizContentCollection.add newSetModel

                console.log @quizContentCollection


            _getNewSetId : ->
                modelsArray = @quizContentCollection.where post_type : 'content_set'
                idArray = _.map _.pluck(modelsArray, 'id'), (id)->
                    parseInt _.ltrim id, 'set '
                if _.isEmpty idArray
                    id = 1
                else
                    id = _.max(idArray) + 1
                return "set #{id}"

            quizContentRemoved : (model)=>

                if model.get('post_type') is 'content-piece'
                    console.log model
                    @contentPiecesCollection.add model



        # set handlers
        App.commands.setHandler "show:quiz:content:selection:app", (options = {})->
            new QuizContentSelection.Controller options
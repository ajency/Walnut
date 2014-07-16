define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/edit-quiz/quiz-content-display/quiz-content-display-views'
], (App, RegionController)->
    App.module "QuizModuleApp.EditQuiz.QuizContentDisplay", (QuizContentDisplay, App)->
        class QuizContentDisplay.Controller extends RegionController
            initialize : (opts)->
                {@model,@quizContentCollection} = opts

                @view = @_getCollectionContentDisplayView()

                @listenTo @view, 'after:item:added', @contentPiecesChanged

                @listenTo @view, 'item:removed', @contentPiecesChanged

                @listenTo @view, 'changed:order', @contentOrderChanged

                @listenTo @view, 'remove:model:from:quiz', @removeModelFromQuiz

                if @quizContentCollection.length > 0
                    App.execute "when:fetched", @quizContentCollection.models, =>
                        @show @view, (loading : true)
                else
                    @show @view, (loading : true)

            contentPiecesChanged : =>
                content = @quizContentCollection.map (quizContent)->
                    if quizContent.get('post_type') is 'content-piece'
                        return { type : 'content-piece'
                        id : quizContent.get('ID') }
                    else
                        return { type : 'content_set'
                        data : quizContent.toJSON() }
                @saveContentPieces content

            contentOrderChanged:(ids)=>
                content = new Array()
                _.each ids,(id)=>
                    if _.str.include(id,'set')
                        setModel = @quizContentCollection.findWhere 'id' : id
                        content.push
                            type : 'content_set'
                            data : setModel.toJSON()
                    else
                        content.push
                            type : 'content-piece'
                            id : parseInt id

                @saveContentPieces content



            saveContentPieces : (content)=>
                console.log content
                @model.set('content_pieces', content)
                @model.save({ 'changed' : 'content_pieces' }, { wait : true })

            _getCollectionContentDisplayView : ->
                new QuizContentDisplay.Views.ContentDisplayView
                    model : @model
                    collection : @quizContentCollection

            removeModelFromQuiz : (id)->
                if _.str.include(id,'set')
                    setModel = @quizContentCollection.findWhere 'id' : id
                    @quizContentCollection.remove setModel
                else
                    @quizContentCollection.remove parseInt id


        App.commands.setHandler "show:quiz:content:display:app", (options)->
            new QuizContentDisplay.Controller options
define ['app'
        'controllers/region-controller'
        'apps/quiz-modules/view-single-quiz/content-display/composite-view'
        ], (App, RegionController)->

    App.module "QuizItemsDisplayApp", (QuizItemsDisplayApp, App)->

        class QuizItemsDisplayApp.Controller extends RegionController

            initialize: (opts)->
                {model, @mode, questionResponseCollection,groupContentCollection} = opts
                
                @view = view = @_getCollectionContentDisplayView model, groupContentCollection, questionResponseCollection

                @show view, (loading: true, entities: [groupContentCollection])

                @listenTo @view, 'view:question:readonly', (questionID)=>
                    @region.trigger 'goto:question:readonly', questionID

            _getCollectionContentDisplayView: (model, collection, responseCollection) =>

                new QuizItemsDisplayApp.ContentCompositeView.View
                    model: model
                    collection: collection
                    responseCollection: responseCollection
                    mode: @mode

        # set handlers
        App.commands.setHandler "show:quiz:items:app", (opt = {})->
            new QuizItemsDisplayApp.Controller opt

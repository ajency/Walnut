define ['app'
        'controllers/region-controller'
        'apps/content-creator/content-pieces-listing/views'

], (App, RegionController)->
    App.module "ContentCreator.ContentPieces", (ContentPieces, App, Backbone, Marionette, $, _)->
        class ContentPiecesController extends RegionController

            initialize: (options)->
                {@contentPieceModel}= options
                @contentPiecesCollection = App.request "empty:content:pieces:collection"
                @contentPiecesCollection.comparator = 'post_modified'
                @contentPiecesCollection.fetch_next = true
                @contentPiecesCollection.fetch_prev = true
                fetchModels = @_getModels @contentPieceModel.id

                fetchModels.done @_showViews

            _getModels:(fromID,direction='next')->
                @defer = $.Deferred()

                models = @contentPiecesCollection.models;
                @currentIndex = 0

                if not _.isEmpty models
                    @currentIndex = _.indexOf @contentPiecesCollection.models, @contentPiecesCollection.get fromID
                    if direction is 'next'
                        @currentIndex++
                        models= (@contentPiecesCollection.models).slice @currentIndex, @currentIndex+12
                    else
                        @currentIndex=@currentIndex-12
                        models= (@contentPiecesCollection.models).slice @currentIndex, @currentIndex+12


                if models.length<12 and @contentPiecesCollection["fetch_#{direction}"]

                    modelsFetch = @_getMoreItems fromID, direction
                    modelsFetch.done (resp)=>
                        @contentPiecesCollection.add resp.items
                        @contentPiecesCollection.sort()

                        if direction is 'next'
                            items= (@contentPiecesCollection.models).slice @currentIndex, @currentIndex+12
                        else
                            @currentIndex=@currentIndex-12
                            items= (@contentPiecesCollection.models).slice @currentIndex, @currentIndex+12

                        if resp.status is 'over'
                            @contentPiecesCollection["fetch_#{direction}"]=false

                        collection = App.request "empty:content:pieces:collection"
                        collection.reset items
                        @defer.resolve collection
                else
                    collection = App.request "empty:content:pieces:collection"
                    collection.reset models
                    @defer.resolve collection

                @defer.promise()

            _getMoreItems:(fromID,direction)=>

                @deferAJAX = $.Deferred()

                data=
                    'action'    : 'get-adjacent-content-pieces'
                    'ID'        : fromID
                    'direction' : direction

                $.get AJAXURL, data
                .done (resp)=>
                    @deferAJAX.resolve resp

                @deferAJAX.promise()

            _showViews:(collection)=>
                collection.comparator = 'post_modified'
                collection.sort()
                @view = new ContentPieces.Views.ContentPieces
                        model: @contentPieceModel
                        collection: collection

                @show @view

                @listenTo @view, "itemview:change:content:piece", (iv,model)=>
                    @contentPieceModel = model
                    @region.trigger 'change:content:piece', model.id

                @listenTo @view, "change:content:piece", (direction)=>
                    currentIndex = _.indexOf @contentPiecesCollection.models, @contentPiecesCollection.get @contentPieceModel.id
                    nextIndex = if direction is 'next' then currentIndex+1 else currentIndex-1
                    model = @contentPiecesCollection.at nextIndex

                    if model
                        @region.trigger 'change:content:piece', model.id
                    else
                        getItems= @_getMoreItems @contentPieceModel.id,direction
                        getItems.done (resp)=>
                            if resp.items.length > 0
                                @region.trigger 'change:content:piece', resp.items[0].ID


                @listenTo @view, "browse:more", @_browseMore

            _browseMore:(direction)=>
                fromModel = if direction is 'next' then @view.collection.last() else @view.collection.first()
                fetchModels = @_getModels fromModel.id, direction
                fetchModels.done (collection)=>
                    @view.collection.reset collection.models if collection.length >0

        App.commands.setHandler "show:content:creator:pieces:listing", (options)->
            new ContentPiecesController options

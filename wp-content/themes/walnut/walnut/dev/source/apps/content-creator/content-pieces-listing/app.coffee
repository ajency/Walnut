define ['app'
        'controllers/region-controller'
        'bootbox'
        'apps/content-creator/content-pieces-listing/views'

], (App, RegionController,bootbox)->
    App.module "ContentCreator.ContentPieces", (ContentPieces, App, Backbone, Marionette, $, _)->
        class ContentPiecesController extends RegionController

            initialize: (options)->
                {@contentPieceModel}= options
                #all content pieces collected. as more are fetched they are added here
                @contentPiecesCollection = App.request "empty:content:pieces:collection"
                @contentPiecesCollection.comparator = 'ID'
                #subset of pieces needed for current view
                @subCollection = App.request "empty:content:pieces:collection"

                fetchModels = @_getModels()

                fetchModels.done @_showViews

            _getModels:(direction='current')->
                @defer = $.Deferred()

                if @contentPiecesCollection.isEmpty()
                    chapterID = @contentPieceModel.get('term_ids').chapter
                else
                    fromModel = if direction is 'next' then @subCollection.last() else @subCollection.first()
                    chapterID = fromModel.get 'chapterID'

                models = @contentPiecesCollection.where 'chapterID': chapterID

                if not _.isEmpty models
                    fromID = if direction is 'next' then @subCollection.last().id else @subCollection.first().id
                    currentIndex = _.indexOf models, @contentPiecesCollection.get fromID
                    if direction in ['current','next']
                        currentIndex++
                        models= models.slice currentIndex, currentIndex+12
                    else
                        currentIndex=currentIndex-12
                        models= models.slice currentIndex, currentIndex+12


                if _.isEmpty(models)

                    modelsFetch = @_getMoreItems direction
                    modelsFetch.done (resp)=>
                        @contentPiecesCollection.add resp.items
                        @contentPiecesCollection.sort()
                        chapterItems = @contentPiecesCollection.where 'chapterID': resp.chapterID

                        if direction is 'current'
                            fromID=@contentPieceModel.id
                            fromID = _.first(chapterItems).id if chapterItems.length<=12
                        else
                            fromID = if direction is 'next' then @subCollection.last().id else @subCollection.first().id

                        currentIndex = _.indexOf chapterItems, @contentPiecesCollection.get fromID
                        currentIndex=0 if currentIndex is -1

                        if direction in ['current','next']
                            items= chapterItems.slice currentIndex, currentIndex+12
                        else
                            currentIndex=currentIndex-12
                            if currentIndex is -12
                                items= chapterItems.slice currentIndex
                            else
                                items= chapterItems.slice currentIndex, currentIndex+12

                        @subCollection.reset items if items.length>0

                        @defer.resolve @subCollection
                else
                    @subCollection.reset models if models.length>0
                    @defer.resolve @subCollection

                @defer.promise()

            _getMoreItems:(direction)=>

                if direction is 'current'
                    chapterID = @contentPieceModel.get('term_ids').chapter
                else
                    fromModel = if direction is 'next' then @subCollection.last() else @subCollection.first()
                    chapterID = fromModel.get('term_ids').chapter

                @deferAJAX = $.Deferred()

                data=
                    'action'    : 'get-adjacent-content-pieces'
                    'chapterID' : chapterID
                    'direction' : direction

                $.get AJAXURL, data
                .done (resp)=>
                    @deferAJAX.resolve resp

                @deferAJAX.promise()

            _showViews:(collection)=>
                collection.comparator = 'ID'
                collection.sort()

                @textbookName = collection.first().get 'textbookName'
                @chapterName = collection.first().get 'chapterName'

                models = collection.filter (model)=>
                            return model if model.get('textbookName') is @textbookName and model.get('chapterName') is @chapterName

                collection.reset models

                @view = new ContentPieces.Views.ContentPieces
                        model: @contentPieceModel
                        collection: collection

                @show @view

                @listenTo @view, "itemview:change:content:piece", (iv,model)=>
                    modelData = model.toJSON()
                    msg = @_getNavigatingMsg modelData

                    if msg
                        bootbox.confirm msg, (confirm)=>
                            if confirm
                                @region.trigger 'change:content:piece', model.id
                                @contentPieceModel = model
                    else
                        @region.trigger 'change:content:piece', model.id
                        @contentPieceModel = model


                @listenTo @view, "change:content:piece", (direction)=>
                    chapterItems = @contentPiecesCollection.where 'chapterID': @contentPieceModel.get('term_ids').chapter
                    currentIndex = _.indexOf chapterItems, @contentPiecesCollection.get @contentPieceModel.id
                    nextIndex = if direction is 'next' then currentIndex+1 else currentIndex-1
                    model = chapterItems[nextIndex]

                    if model
                        @region.trigger 'change:content:piece', model.id
                    else
                        getItems= @_getMoreItems direction
                        getItems.done (resp)=>
                            if resp.items.length > 0
                                resp.items = _.sortBy resp.items, 'ID' if resp.items.length>0
                                nextItem = if direction is 'next' then _.first(resp.items) else _.last resp.items
                                msg = @_getNavigatingMsg nextItem
                                bootbox.confirm msg, (confirm)=>
                                    @region.trigger 'change:content:piece', nextItem.ID if confirm


                @listenTo @view, "browse:more", @_browseMore

            _getNavigatingMsg:(item)->
                currentTextbook = @contentPieceModel.get('term_ids').textbook
                newTextbook = item.term_ids.textbook

                if currentTextbook isnt newTextbook
                    return "<h4>Textbook Change<br>
                        You will be navigating to textbook:
                        <span class='semi-bold'> #{item.textbookName}</span></h4>"

                currentChapter = @contentPieceModel.get('term_ids').chapter
                newChapter = item.term_ids.chapter

                if currentChapter isnt newChapter
                    return "<h4>Chapter Change<br>
                        You will be navigating to chapter:
                        <span class='semi-bold'> #{item.chapterName}</span></h4>"

            _browseMore:(direction)=>
                fetchModels = @_getModels direction
                fetchModels.done (collection)=>
                    if not collection.isEmpty()
                        @textbookName = collection.first().get 'textbookName'
                        @chapterName  = collection.first().get 'chapterName'

                        models = collection.filter (model)=>
                                    return model if model.get('textbookName') is @textbookName and model.get('chapterName') is @chapterName

                        @view.collection.reset models if models.length >0

        App.commands.setHandler "show:content:creator:pieces:listing", (options)->
            new ContentPiecesController options

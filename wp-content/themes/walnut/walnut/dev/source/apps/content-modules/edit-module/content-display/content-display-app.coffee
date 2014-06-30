define ['app'
        'controllers/region-controller'
        'text!apps/content-modules/edit-module/content-display/templates/content-display.html'], (App, RegionController, contentDisplayItemTpl)->
    App.module "CollectionContentDisplayApp.Controller", (Controller, App)->
        class Controller.CollectionEditContentDisplayController extends RegionController

            initialize : (opts)->
                {@model,@contentGroupCollection} = opts

                @view = view = @_getCollectionContentDisplayView @model, @contentGroupCollection

                @listenTo @contentGroupCollection, 'content:pieces:of:group:added', @contentPiecesChanged

                @listenTo @contentGroupCollection, 'content:pieces:of:group:removed', @contentPiecesChanged

                @listenTo view, 'changed:order', @saveContentPieces

                if @contentGroupCollection.length > 0
                    App.execute "when:fetched", @contentGroupCollection.models, =>
                        @show view, (loading : true)
                else
                    @show view, (loading : true)




            contentPiecesChanged : =>
                contentIDs = @contentGroupCollection.pluck 'ID'
                @saveContentPieces contentIDs

            saveContentPieces : (contentIDs)=>
                @model.set('content_pieces', contentIDs)
                @model.save({ 'changed' : 'content_pieces' }, { wait : true })

            _getCollectionContentDisplayView : (model, collection) ->
                new ContentDisplayView
                    model : model
                    collection : collection


        class ContentItemView extends Marionette.ItemView

            template : contentDisplayItemTpl

            tagName : 'li'

            className : 'sortable'

            onShow : ->
                @$el.attr 'id', @model.get 'ID'


        class ContentDisplayView extends Marionette.CompositeView

            template : '<ul class="cbp_tmtimeline"></ul>'

            itemView : ContentItemView

            itemViewContainer : 'ul.cbp_tmtimeline'

            className : 'col-md-10'

            id : 'myCanvas-miki'

            events :
                'click .remove' : 'removeItem'

            modelEvents :
                'change:status' : 'statusChanged'

            statusChanged : (model, status)->
                if status in ['publish', 'archive']
                    @$el.find('.remove').hide()
                    @$el.find(".cbp_tmtimeline").sortable('disable')
                else
                    @$el.find('.remove').show()


            onShow : ->
                @$el.find(".cbp_tmtimeline").sortable

                    stop : (event, ui)=>
                        sorted_order = @$el.find(".cbp_tmtimeline")
                        .sortable "toArray"
                        console.log sorted_order
                        @trigger "changed:order", sorted_order

                @statusChanged @model, @model.get('status')


            removeItem : (e)=>
                id = $(e.target)
                .closest '.contentPiece'
                    .attr 'data-id'

                @collection.remove parseInt id


        # set handlers
        App.commands.setHandler "show:editgroup:content:displayapp", (opt = {})->
            new Controller.CollectionEditContentDisplayController opt


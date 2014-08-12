define ['app', 'controllers/region-controller', 'apps/media/grid/views'], (App, AppController)->

    #Login App module
    App.module "Media.Grid", (Grid, App)->

        #Show Controller
        class Grid.Controller extends AppController

            # initialize
            initialize: (opts)->

                {@mediaType}= opts
                data= mediaType: @mediaType

                if @mediaType is 'image'
                    @mediaCollection = App.request "fetch:media", data
                else
                    @mediaCollection = App.request "get:empty:media:collection"

                @view = @_getView @mediaCollection

                App.execute "when:fetched", @mediaCollection,=>
                    @show @view, loading: true

                @listenTo @view, "itemview:media:element:selected", (iv) =>
                    # trigger "media:element:clicked" event on the region. the main app controller will
                    # listen to this event and get the clicked model and pass it on to edit media app
                    Marionette.triggerMethod.call(@region,
                      "media:element:selected",
                      Marionette.getOption(iv, 'model'));

                @listenTo @view, "itemview:media:element:unselected", (iv) =>
                    Marionette.triggerMethod.call(@region,
                      "media:element:unselected",
                      Marionette.getOption(iv, 'model'));

                @listenTo @view, "itemview:delete:media:image", ( iv, model ) =>
                    @deleteImage model

                @listenTo @view, "itemview:show:image:editor", (iv, model) =>
                    ratio  = App.currentImageRatio
                    editView = App.request "get:image:editor:view", model, 
                                                            aspectRatio : ratio
                    @view.triggerMethod "show:edit:image", editView
                    @view.listenTo editView, "image:editing:cancelled", ->
                        @view.triggerMethod "image:editing:cancelled"


                App.commands.setHandler "new:media:added",(media)=>
                    @mediaCollection.add media

                @listenTo @view, "search:media", @_searchMedia


            _searchMedia: (searchStr) =>
                data=
                    mediaType: @mediaType
                    searchStr: searchStr

                @mediaCollection = App.request "fetch:media", data

                App.execute "when:fetched", @mediaCollection, =>
                    @view.triggerMethod "media:collection:fetched", @mediaCollection

            # gets the main login view
            _getView: (@mediaCollection)->
                new Grid.Views.GridView
                    collection: @mediaCollection
                    mediaType: @mediaType

            #delete a image from the gallery
            deleteImage : ( imageModel )->
                imageModel.destroy
                    allData : false
                    wait : true


        App.commands.setHandler 'start:media:grid:app', (options) =>
            new Grid.Controller
                region: options.region
                mediaType: options.mediaType
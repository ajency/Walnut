define ['app', 'controllers/region-controller', 'apps/media/grid/views'], (App, AppController)->

    #Login App module
    App.module "Media.Grid", (Grid, App)->

        #Show Controller
        class Grid.Controller extends AppController

            # initialize
            initialize: (opts)->

                {mediaType}= opts
                data= mediaType: mediaType
                mediaCollection = App.request "fetch:media", data
                view = @_getView mediaCollection

                @listenTo view, "itemview:media:element:selected", (iv) =>
                    # trigger "media:element:clicked" event on the region. the main app controller will
                    # listen to this event and get the clicked model and pass it on to edit media app
                    Marionette.triggerMethod.call(@region,
                      "media:element:selected",
                      Marionette.getOption(iv, 'model'));

                @listenTo view, "itemview:media:element:unselected", (iv) =>
                    Marionette.triggerMethod.call(@region,
                      "media:element:unselected",
                      Marionette.getOption(iv, 'model'));

                App.execute "when:fetched", mediaCollection,=>
                    @show view, loading: true


            # gets the main login view
            _getView: (mediaCollection)->
                console.log mediaCollection
                new Grid.Views.GridView
                    collection: mediaCollection


        App.commands.setHandler 'start:media:grid:app', (options) =>
            new Grid.Controller
                region: options.region
                mediaType: options.mediaType
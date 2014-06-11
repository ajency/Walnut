define ['app', 'controllers/region-controller', 'apps/media/edit-media/views'], (App, AppController)->

    #Login App module
    App.module "Media.EditMedia", (EditMedia, App)->

        #Show Controller
        class EditMedia.Controller extends AppController

            # initialize
            initialize : (opt = {})->
                {model} = opt
                view = @_getView model

                @listenTo view, "size:select:changed", (newSize)=>
                    Marionette.triggerMethod.call(@region, "size:select:changed", newSize)

                @listenTo view, 'update:image:data', (data)->
                    model.set data
                    model.save null,
                        wait : true


                @show view

            # gets the main login view
            _getView : (mediaModel)->
                new EditMedia.Views.EditMediaView
                    model : mediaModel


        App.commands.setHandler "show:edit:media", (model, region)->
            new EditMedia.Controller
                model : model
                region : region

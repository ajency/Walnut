define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/media-property-box/views']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.MediaPropertyBox",
    (MediaPropertyBox, App, Backbone, Marionette, $, _)->
        class MediaPropertyBox.Controller extends RegionController

            initialize: (options)->
                App.execute "close:question:elements"
                App.execute "close:question:element:properties"

                @model = options.model

                @view = @_getView @model

                @show @view

            _getView: (model)->
                new MediaPropertyBox.Views.PropertyView
                    model: model

            onClose: ->
                @model.save()

        App.commands.setHandler "show:audio:properties", (options)->
            new MediaPropertyBox.Controller
                region: options.region
                model: options.model

        App.commands.setHandler "show:video:properties", (options)->
            new MediaPropertyBox.Controller
                region: options.region
                model: options.model

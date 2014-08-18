define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/table-property-box/table-property-box-views']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.TablePropertyBox",
    (TablePropertyBox, App, Backbone, Marionette, $, _)->
        class TablePropertyBox.Controller extends RegionController

            initialize: (options)->
                App.execute "close:question:elements"
                App.execute "close:question:element:properties"

                @model = options.model

                @view = @_getView @model

                @show @view

            _getView: (model)->
                new TablePropertyBox.Views.PropertyView
                    model: model




        App.commands.setHandler "show:table:properties", (options)->
            new TablePropertyBox.Controller
                region: options.region
                model: options.model
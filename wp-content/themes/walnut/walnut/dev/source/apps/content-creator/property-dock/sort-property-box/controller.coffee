define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/sort-property-box/views']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.SortPropertyBox",
    (SortPropertyBox, App, Backbone, Marionette, $, _)->
        class SortPropertyBox.Controller extends RegionController

            initialize: (options)->
                App.execute "close:question:elements"
                App.execute "close:question:element:properties"

                @model = options.model

                @view = @_getView @model

                @show @view

            _getView: (model)->
                new SortPropertyBox.Views.PropertyView
                    model: model



            onClose: ->
                models = @model.get('elements').models

                elements = _.map models, (m)->
                    m.toJSON()
                console.log elements
                @model.set 'elements': elements

                @model.save()

                optionCollection = App.request "create:new:option:collection", models

                @model.set 'elements', optionCollection
                console.log @model
        #localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())


        App.commands.setHandler "show:sort:properties", (options)->
            new SortPropertyBox.Controller
                region: options.region
                model: options.model
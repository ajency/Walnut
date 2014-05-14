define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/views'
        'apps/content-creator/property-dock/question-element-box-loader'], (App, RegionController)->
    App.module "ContentCreator.PropertyDock", (PropertyDock, App, Backbone, Marionette, $, _)->
        class PropertyDockController extends RegionController

            initialize: (options)->

                {@saveModelCommand}= options

                @layout = @_getLayout()

                App.commands.setHandler "show:question:elements", (options)=>
                    @_getElementBox options.model

                App.commands.setHandler "show:question:properties", (options)=>
                    @_getElementProperties options.model

                # show hotspot element properties
                App.commands.setHandler "show:hotspot:element:properties", (options)=>
                    @_getHotspotElementProperties options

                # show fib element properties
                App.commands.setHandler "show:fib:element:properties", (options)=>
                    @_getFibElementProperties options

                App.commands.setHandler "close:question:element:properties", =>
                    @layout.questElementPropRegion.close()

                App.commands.setHandler "close:question:elements", =>
                    @layout.questElementRegion.close()

                App.commands.setHandler "close:question:properties", =>
                    @layout.questPropertyRegion.close()


                @show @layout

                @listenTo @layout, "save:question", => @saveModelCommand.execute "save:model:data"

            _getLayout: ->
                new PropertyDock.Views.Layout




            _getElementBox: (model)->
                elementName = model.get('element')
                ele = _.slugify(elementName)
                App.execute "show:#{ele}:elements",
                    region: @layout.questElementRegion
                    model: model

            _getHotspotElementProperties: (options)->
                App.execute "show:hotspot:element:properties:box",
                    region: @layout.questElementPropRegion
                    model: options.model
                    hotspotModel: options.hotspotModel

            _getFibElementProperties: (options)->
                App.execute "show:fib:element:properties:box",
                    region: @layout.questElementPropRegion
                    model: options.model
                    fibModel: options.fibModel
            # blankNo : options.blankNo

            _getElementProperties: (model)->
                elementName = model.get 'element'
                ele = _.slugify elementName
                App.execute "show:#{ele}:properties",
                    region: @layout.questPropertyRegion
                    model: model


        App.commands.setHandler "show:property:dock", (options)->
            new PropertyDockController options
define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/biganswer-property-box/views']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.BigAnswerPropertyBox",
    (BigAnswerPropertyBox, App, Backbone, Marionette, $, _)->
        class BigAnswerPropertyBox.Controller extends RegionController

            initialize: (options)->
                App.execute "close:question:elements"
                App.execute "close:question:element:properties"

                @model = options.model

                # get property view
                @layout = @_getView @model

                # show view
                @show @layout

            # function to get the property view
            _getView: (model)->
                new BigAnswerPropertyBox.Views.PropertyView
                    model: model

            # on close of property box save the model
            onClose: ->
                console.log @model

                if @model.get('marks') > 0
                    @model.set 'complete',true                    
                else                
                    @model.set 'complete',false


                @model.save()
        #localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())

        App.commands.setHandler "show:biganswer:properties", (options)->
            new BigAnswerPropertyBox.Controller
                region: options.region
                model: options.model
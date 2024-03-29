define ['app'
        'controllers/region-controller'
        'apps/content-creator/property-dock/hotspot-property-box/view']
, (App, RegionController)->
    App.module "ContentCreator.PropertyDock.HotspotPropertyBox",
    (HotspotPropertyBox, App, Backbone, Marionette, $, _)->
        class HotspotPropertyBox.Controller extends RegionController

            initialize: (options)->
                @model = options.model

                # get property view
                @layout = @_getView @model

                # show view
                @show @layout

            # function to get the property view
            _getView: (model)->
                new HotspotPropertyBox.Views.PropertyView
                    model: model

            # on close of property box save the model
            onClose: ->
                App.execute "save:hotspot:content"
                console.log @model

                collection_types = ['option', 'image', 'text']

                optionCollection = this.model.get('optionCollection').models

                optionModels = _.map optionCollection, (m)->
                    m.toJSON()

                @model.set 'optionCollection': optionModels

                imageCollection = this.model.get('imageCollection').models

                imageModels = _.map imageCollection, (m)->
                    m.toJSON()

                @model.set 'imageCollection': imageModels

                textCollection = this.model.get('textCollection').models

                textModels = _.map textCollection, (m)->
                    m.toJSON()

                @model.set 'textCollection': textModels

                optsColl = @model.get 'optionCollection'

                if @model.get('marks') > 0 and not _.every(optsColl,(option)-> return not option.correct)
                    @model.set 'complete', true
                else
                    @model.set 'complete',false

                if @model.get 'enableIndividualMarks'
                    correctAns= _.where optsColl, 'correct':true
                    @model.set 'complete',false if not _.every(correctAns,(option)-> return true if option.marks >0)

                @model.save()

                optionCollection = App.request "create:new:hotspot:element:collection", optionCollection
                imageCollection = App.request "create:new:hotspot:element:collection", imageCollection
                textCollection = App.request "create:new:hotspot:element:collection", textCollection

                @model.set
                    'optionCollection': optionCollection
                    'imageCollection': imageCollection
                    'textCollection': textCollection


        App.commands.setHandler "show:hotspot:properties", (options)->
            new HotspotPropertyBox.Controller
                region: options.region
                model: options.model
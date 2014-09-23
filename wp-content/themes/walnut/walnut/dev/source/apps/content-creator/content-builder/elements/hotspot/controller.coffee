define ['app'
        'apps/content-creator/content-builder/element/controller'
        'apps/content-creator/content-builder/elements/hotspot/views'],
(App, Element)->
    App.module 'ContentCreator.ContentBuilder.Element.Hotspot', (Hotspot, App, Backbone, Marionette, $, _)->


        # menu controller
        class Hotspot.Controller extends Element.Controller

            # intializer
            initialize : (options)->
                @eventObj = options.eventObj

                _.defaults options.modelData,
                    element : 'Hotspot'
                    height : 0
                    marks : 1
                    transparent : false
                    enableIndividualMarks : false
                    optionCollection : []
                    textCollection : []
                    imageCollection : []
                    complete : false

                super(options)

            _getHotspotView : ()->
                new Hotspot.Views.HotspotView
                    model : @layout.model


            # setup templates for the element
            renderElement : ()=>
                optionCollectionArray = @layout.model.get 'optionCollection'

                textCollectionArray = @layout.model.get 'textCollection'

                imageCollectionArray = @layout.model.get 'imageCollection'

                @_parseArray optionCollectionArray, textCollectionArray, imageCollectionArray

                @optionCollection = App.request "create:new:hotspot:element:collection", optionCollectionArray
                @textCollection = App.request "create:new:hotspot:element:collection", textCollectionArray
                @imageCollection = App.request "create:new:hotspot:element:collection", imageCollectionArray

                @layout.model.set 'optionCollection', @optionCollection
                @layout.model.set 'textCollection', @textCollection
                @layout.model.set 'imageCollection', @imageCollection
                # @removeSpinner()
                # get menu
                @view = @_getHotspotView()

                # listen to show event, and trigger show property box event
                # listen to show property box event and show the property by passing the current model
                @listenTo @view, "show show:hotspot:elements", =>
                    App.execute "show:question:elements",
                        model : @layout.model
                    App.execute "show:question:properties",
                        model : @layout.model


                # @listenTo @view, "close:hotspot:elements", (contentObject)=>
                # 		# console.log JSON.stringify contentObject
                # 		@layout.model.set 'content', JSON.stringify contentObject
                # 		# console.log JSON.stringify @model.toJSON()

                # 		App.execute "close:question:elements"

                # App.commands.setHandler  "save:hotspot:content",=>
                # 	@view.triggerMethod "save:hotspot:content"
                # App.execute "close:question:elements"

                # listen to view event for closing the hotspot element property region
                # on mouse down anywhere on the hotspot except on the element
                @listenTo @view, "close:hotspot:element:properties", ->
                    App.execute "close:question:element:properties"

                @listenTo @view, "show:hotspot:element:properties", (hotspotElement)->
                    App.execute "show:hotspot:element:properties",
                        model : hotspotElement
                        hotspotModel : @layout.model


                @layout.elementRegion.show @view,
                    loading : true

            _parseArray : (optionCollectionArray, textCollectionArray, imageCollectionArray)->
                _.each optionCollectionArray, (option)=>
                    @_parseObject option

                _.each textCollectionArray, (text)=>
                    @_parseObject text

                _.each imageCollectionArray, (image)=>
                    @_parseObject image

            _parseObject : (object)->
                Integers = ['radius', 'marks', 'width', 'height', 'angle', 'textAngle', 'fontSize']
                Floats = ['x', 'y']
                Booleans = ['toDelete', 'correct']

                _.each object, (value, key)->
                    object[key] = parseInt value if key in Integers
                    object[key] = parseFloat value if key in Floats
                    object[key] = _.toBoolean value if key in Booleans



            # remove the element model and close all the property regions
            deleteElement : (model)->
                model.set('optionCollection', '')
                # delete model.get 'optionCollection'
                model.set('textCollection', '')
                # delete model.get 'textCollection'
                model.set('imageCollection', '')
                # delete model.get 'imageCollection'
                super model
                App.execute "close:question:elements"
                App.execute "close:question:properties"
                App.execute "close:question:element:properties"
# # on delete enable all question elements in d element box
# @eventObj.vent.trigger "question:removed"


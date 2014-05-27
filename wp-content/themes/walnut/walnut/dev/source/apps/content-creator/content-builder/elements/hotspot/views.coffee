define ['app'], (App)->

    # Row views
    App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

        # Menu item view
        class Views.HotspotView extends Marionette.ItemView

            className: 'stage'

            # template : '&nbsp;'

            # events :
            # 'mousedown' : -> @trigger "show:hotspot:elements"
            # 'focus'	: -> console.log "blur" #'updateModel'

            initialize: (opt = {})->
                # get the content if already exists
                # if @model.get('content') isnt ''

                # 	@contentObject = JSON.parse @model.get 'content'
                # else
                # 	@contentObject = new Object()




                # create layer collections
                @textCollection = @model.get 'textCollection' #App.request "create:new:hotspot:element:collection", @contentObject.textData
                @optionCollection = @model.get 'optionCollection' #App.request "create:new:hotspot:element:collection", @contentObject.optionData
                @imageCollection = @model.get 'imageCollection' #App.request "create:new:hotspot:element:collection", @contentObject.imageData

                #give a unique name to every hotspot canvas
                @stageName = _.uniqueId('stage')

                # create the canvas layers
                @imageLayer = new Kinetic.Layer
                    name: 'imageLayer'
                @optionLayer = new Kinetic.Layer
                    name: 'optionLayer'
                @textLayer = new Kinetic.Layer
                    name: 'textLayer'
                @defaultLayer = new Kinetic.Layer
                    name: 'defaultLayer'

            onRender: ->
                @$el.attr 'id', @stageName


            onShow: ()->
                # create a kinetic stage
                @stage = new Kinetic.Stage
                    container: @stageName
                    width: @$el.parent().width()
                    height: @$el.parent().height() + 80

                if @model.get('height') isnt 0
                    @stage.height @model.get('height')


                # add the canvas layers
                @stage.add @defaultLayer
                @stage.add @imageLayer
                @stage.add @textLayer
                @stage.add @optionLayer


                @_initializeCanvasResizing()


                @$el.parent().parent().on 'click', (evt)=>
                    @trigger 'show:hotspot:elements'
                    evt.stopPropagation()

                @$el.parent().parent().on 'mousedown', (evt)=>
                    @trigger 'close:hotspot:element:properties'
                    evt.stopPropagation()

                # @_setPropertyBoxCloseHandlers()
                @_drawExistingElements()

                #make the hotspot canvas area dropable
                @$el.find('.kineticjs-content').droppable
                    accept: '.hotspotable'
                    drop: (evt, ui)=>
                        if ui.draggable.prop("tagName") is 'LI'
                            type = ui.draggable.attr 'data-element'
                            elementPos =
                                left: evt.clientX - @$el.find('.kineticjs-content').offset().left
                                top: evt.clientY - @$el.find('.kineticjs-content').offset().top + window.pageYOffset
                            @triggerMethod "add:hotspot:element", type, elementPos

            _initializeCanvasResizing: ->
                # on resize of the canvas height
                @$el.resize @_setResizeHandler
                @model.set 'height', @stage.height()
                # set resize bottom handle
                @$el.resizable
                    handles: "s"

            _setResizeHandler: =>
                # console.log $('#'+@stageName+'.stage').width()
                @stage.setSize
                    width: @$el.width()
                    height: @$el.height() - 5

                @model.set 'height', @stage.height()
                # resize the default image
                @_updateDefaultImageSize()


            _setDefaultImage: ->
                defaultImage = new Image()
                defaultImage.onload = ()=>
                    @hotspotDefault = new Kinetic.Image
                        image: defaultImage

                    @defaultLayer.add @hotspotDefault
                    _.delay =>
                        @_updateDefaultLayer()
                    , 500
                    @_updateDefaultImageSize()

                defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg"

            # remove the default image from the layer if any hotspot elements are added
            _updateDefaultLayer: ->
                i = 1
                isEmptyFlag = true
                while i < @stage.getChildren().length
                    if i
                        if @stage.getChildren()[i].getChildren().length
                            @defaultLayer.removeChildren()
                            console.log "remove default"
                            isEmptyFlag = false
                            break;
                    i++
                if isEmptyFlag
                    # console.log "in else"
                    if not @stage.getChildren()[0].getChildren().length
                        # console.log 'in if'
                        @_setDefaultImage()
                @defaultLayer.draw()


            # update the size of default image on change of stage
            _updateDefaultImageSize: ->
                if @hotspotDefault

                    width = @stage.width()
                    height = @stage.height()
                    @hotspotDefault.setSize
                        width: 336
                        height: 200

                    if(width < 220)
                        @hotspotDefault.setSize
                            width: width - 10
                            height: (width - 10) / 1.68

                    if(height < 160)
                        @hotspotDefault.setSize
                            width: (height - 10) * 1.68
                            height: height - 10

                    @hotspotDefault.position
                        x: @stage.width() / 2 - @hotspotDefault.width() / 2
                        y: @stage.height() / 2 - @hotspotDefault.height() / 2

                    @defaultLayer.draw()

            # _setPropertyBoxCloseHandlers:->
            # 	$('body').on 'click',=>

            # 			@contentObject.textData = @textCollection.toJSON()
            # 			@contentObject.optionData = @optionCollection.toJSON()
            # 			@contentObject.imageData = @imageCollection.toJSON()
            # 			console.log JSON.stringify @contentObject

            # 			@trigger "close:hotspot:elements",@contentObject

            # onSaveHotspotContent:->
            # 		@contentObject.textData = @textCollection.toJSON()
            # 		@contentObject.optionData = @optionCollection.toJSON()
            # 		@contentObject.imageData = @imageCollection.toJSON()

            # 		@model.set 'optionCollection',@optionCollection

            # 		@model.set 'content', JSON.stringify @contentObject



            _drawExistingElements: ->
                console.log @textCollection

                @textCollection.each (model, i)=>
                    @_addEachElements 'Hotspot-Text', model

                @optionCollection.each (model, i)=>
                    if model.get('shape') is 'Rect'
                        @_addEachElements 'Hotspot-Rectangle', model

                    if model.get('shape') is 'Circle'
                        @_addEachElements 'Hotspot-Circle', model

                @imageCollection.each (model, i)=>
                    @_addEachElements 'Hotspot-Image', model

                @_updateDefaultLayer()

                _.delay =>
                    @$el.trigger('mousedown')
                , 10

            _addEachElements: (type, model)->
                @triggerMethod "add:hotspot:element",
                    type
                ,
                    left: model.get 'x'
                    top: model.get 'y'
                ,
                    model





            onAddHotspotElement: (type, elementPos, model)->
                if(type == "Hotspot-Circle")
                    @_addCircle elementPos, model

                else if(type == "Hotspot-Rectangle")
                    @_addRectangle elementPos, model

                else if(type == "Hotspot-Text")
                    @_addTextElement elementPos, model
                else if(type == "Hotspot-Image")
                    # if model exists display it otherwise upload an image
                    if model
                        @_addImageElement elementPos, model.get('url'), model
                    else
                        @_uploadImage elementPos


                @_updateDefaultLayer()

            # @optionLayer.draw()

            _uploadImage: (elementPos)->
                App.navigate "media-manager", trigger: true
                @listenTo App.vent, "media:manager:choosed:media", (media)=>
                    # @layout.model.set 'image_id', media.get 'id'
                    @_addImageElement elementPos, media.toJSON().url
                    # @layout.model.save()
                    @stopListening App.vent, "media:manager:choosed:media"

                @listenTo App.vent, "stop:listening:to:media:manager", =>
                    @stopListening App.vent, "media:manager:choosed:media"


            _addCircle: (elementPos, model)->
                if model
                    hotspotElement = model

                else
                    modelData =
                        id: _.uniqueId('option')
                        type: 'Option'
                        shape: 'Circle'
                        x: elementPos.left
                        y: elementPos.top
                        radius: 20
                        color: '#000000'
                    # transparent : false
                        correct: false
                        marks: 1

                    hotspotElement = App.request "create:new:hotspot:element", modelData
                    @optionCollection.add hotspotElement

                self = @


                @trigger "show:hotspot:element:properties", hotspotElement


                circle = new Kinetic.Circle
                    id: hotspotElement.get 'id'
                    x: hotspotElement.get 'x'
                    y: hotspotElement.get 'y'
                    radius: hotspotElement.get 'radius'
                    stroke: hotspotElement.get 'color'
                    strokeWidth: 2
                    dash: [6, 4 ]
                    dashEnabled: @model.get 'transparent'
                    fill: if hotspotElement.get("correct") then "rgba(12, 199, 55, 0.28)" else ""

                circleGrp = resizeCircle circle, @optionLayer

                circleGrp.on 'dragend', (e)->
                    hotspotElement.set 'x', circle.getAbsolutePosition().x
                    hotspotElement.set 'y', circle.getAbsolutePosition().y
                    hotspotElement.set 'radius', circle.radius()

                # on change of transparency redraw
                @model.on "change:transparent", (model, transparent)=>
                    circle.dashEnabled transparent
                    @optionLayer.draw()

                # on change of color redraw
                hotspotElement.on "change:color", =>
                    circle.stroke hotspotElement.get 'color'
                    @optionLayer.draw()

                # on change of model correct shade the option
                hotspotElement.on "change:correct", =>
                    if hotspotElement.get 'correct'
                        circle.fill 'rgba(12, 199, 55, 0.28)'

                    else
                        circle.fill ''
                    # console.log hotspotElement.get 'correct'
                    @optionLayer.draw()

                # delete element based on toDelete
                hotspotElement.on "change:toDelete", =>
                    circleGrp.destroy()
                    @optionCollection.remove hotspotElement

                    @trigger "close:hotspot:element:properties"
                    @optionLayer.draw()
                    @_updateDefaultLayer()

                # on click of a circle element show properties
                circleGrp.on 'mousedown ', (e)=>
                    e.stopPropagation()

                    @trigger "show:hotspot:element:properties", hotspotElement
                # console.log @


                @optionLayer.draw()


            _addRectangle: (elementPos, model)->
                if model
                    hotspotElement = model

                else
                    modelData =
                        id: _.uniqueId('option')
                        type: 'Option'
                        shape: 'Rect'
                        x: elementPos.left
                        y: elementPos.top
                        width: 30
                        height: 30
                        color: '#000000'
                    # transparent : false
                        angle: 0
                        correct: false
                        marks: 1


                    hotspotElement = App.request "create:new:hotspot:element", modelData
                    @optionCollection.add hotspotElement


                self = @

                @trigger "show:hotspot:element:properties", hotspotElement

                box = new Kinetic.Rect
                    id: hotspotElement.get 'id'
                # name : "rect2"
                    x: hotspotElement.get 'x'
                    y: hotspotElement.get 'y'
                    width: hotspotElement.get 'width'
                    height: hotspotElement.get 'height'
                    stroke: hotspotElement.get 'color'
                    strokeWidth: 2
                    dash: [6, 4 ]
                    dashEnabled: @model.get 'transparent'
                    fill: if hotspotElement.get("correct") then "rgba(12, 199, 55, 0.28)" else ""

                rectGrp = resizeRect box, @optionLayer

                rectGrp.rotation hotspotElement.get 'angle'

                rectGrp.on 'dragend', (e)->
                    hotspotElement.set 'x', box.getAbsolutePosition().x
                    hotspotElement.set 'y', box.getAbsolutePosition().y
                    hotspotElement.set 'width', box.width()
                    hotspotElement.set 'height', box.height()

                # on change of transparency redraw
                @model.on "change:transparent", (model, transparent)=>
                    console.log rectGrp
                    box.dashEnabled transparent
                    @optionLayer.draw()

                # on change of color redraw
                hotspotElement.on "change:color", =>
                    box.stroke hotspotElement.get 'color'
                    @optionLayer.draw()

                # on change of model's angle rotate the element
                hotspotElement.on "change:angle", =>
                    rectGrp.rotation hotspotElement.get 'angle'
                    @optionLayer.draw()

                # on change of model correct shade the option
                hotspotElement.on "change:correct", =>
                    if hotspotElement.get 'correct'
                        box.fill 'rgba(12, 199, 55, 0.28)'

                    else
                        box.fill ''
                    # console.log hotspotElement.get 'correct'
                    @optionLayer.draw()

                # delete element based on toDelete
                hotspotElement.on "change:toDelete", =>
                    rectGrp.destroy()
                    @optionCollection.remove hotspotElement
                    @trigger "close:hotspot:element:properties"
                    @optionLayer.draw()
                    @_updateDefaultLayer()

                # on click of a circle element show properties
                rectGrp.on 'mousedown ', (e)=>
                    e.stopPropagation()
                    @trigger "show:hotspot:element:properties", hotspotElement
                # console.log @


                @optionLayer.draw()




            _addTextElement: (elementPos, model)->
                if model
                    hotspotElement = model

                else
                    modelData =
                        x: elementPos.left
                        y: elementPos.top
                        type: 'Text'
                        text: ''
                        fontFamily: 'Arial'
                        fontSize: '14'
                        fontColor: '#000000'
                        fontBold: ''
                        fontItalics: ''
                        textAngle: 0

                    hotspotElement = App.request "create:new:hotspot:element", modelData
                    @textCollection.add hotspotElement


                self = @

                @trigger "show:hotspot:element:properties", hotspotElement

                tooltip = new Kinetic.Label
                    x: hotspotElement.get 'x'
                    y: hotspotElement.get 'y'
                    width: 100
                    draggable: true
                    dragBoundFunc: (pos)->
                        self._setBoundRegion(pos, @, self.stage)

                canvasText = new Kinetic.Text
                    text: 'CLICK TO ENTER TEXT'
                    opacity: 0.3
                    fontFamily: hotspotElement.get 'fontFamily'
                    fontSize: hotspotElement.get 'fontSize'
                    fill: hotspotElement.get 'fontColor'
                    fontStyle: hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics')
                    padding: 5
                    rotation: hotspotElement.get 'textAngle'

                tooltip.on 'dragend', (e)->
                    hotspotElement.set 'x', tooltip.getAbsolutePosition().x
                    hotspotElement.set 'y', tooltip.getAbsolutePosition().y


                # on click of a text element show properties
                tooltip.on 'mousedown ', (e)=>
                    e.stopPropagation()
                    @trigger "show:hotspot:element:properties", hotspotElement

                # if model text is not empty then change the hotspot text
                if hotspotElement.get('text') != ''
                    canvasText.setText hotspotElement.get 'text'
                    canvasText.opacity 1
                    canvasText.fill hotspotElement.get 'fontColor'


                # on change of text update the canvas
                hotspotElement.on "change:text", =>
                    if hotspotElement.get('text') != ""
                        canvasText.setText hotspotElement.get 'text'
                        canvasText.opacity 1
                        canvasText.fill hotspotElement.get 'fontColor'
                    else
                        canvasText.setText 'CLICK TO ENTER TEXT'
                        canvasText.opacity 0.3
                        canvasText.fill 'fontColor'
                    # tooltip.fire "moverotator"

                    @textLayer.draw()

                # on change of font Size update the canvas
                hotspotElement.on "change:fontSize", =>
                    canvasText.fontSize hotspotElement.get 'fontSize'
                    # tooltip.fire "moverotator"
                    @textLayer.draw()


                # on change of font  update the canvas
                hotspotElement.on "change:fontFamily", =>
                    canvasText.fontFamily hotspotElement.get 'fontFamily'
                    # tooltip.fire "moverotator"
                    @textLayer.draw()


                # on change of font Style update the canvas
                hotspotElement.on "change:fontBold change:fontItalics", =>
                    canvasText.fontStyle hotspotElement.get('fontBold') + " " + hotspotElement.get('fontItalics')
                    # tooltip.fire "moverotator"
                    @textLayer.draw()

                # on change of font color update the canvas
                hotspotElement.on "change:fontColor", =>
                    canvasText.fill hotspotElement.get 'fontColor'
                    # tooltip.fire "moverotator"
                    @textLayer.draw()

                # on change of toDelete property remove the text element from the canvas
                hotspotElement.on "change:toDelete", =>
                    tooltip.destroy()
                    @textCollection.remove hotspotElement
                    @trigger "close:hotspot:element:properties"
                    @textLayer.draw()
                    @_updateDefaultLayer()

                # on change of the textAngle prop rotate the text
                hotspotElement.on "change:textAngle", =>
                    tooltip.rotation hotspotElement.get 'textAngle'
                    @textLayer.draw()


                tooltip.add canvasText


                @textLayer.add tooltip

                @textLayer.draw()

            _addImageElement: (elementPos, url, model)->
                if model
                    hotspotElement = model

                else
                    modelData =
                        type: 'Image'
                        x: elementPos.left
                        y: elementPos.top
                        width: 150
                        height: 150
                        angle: 0
                        url: url

                    hotspotElement = App.request "create:new:hotspot:element", modelData
                    @imageCollection.add hotspotElement

                imageGrp = null

                imageObject = new Image()
                imageObject.src = hotspotElement.get 'url'
                imageObject.onload = ()=>
                    @trigger "show:hotspot:element:properties", hotspotElement

                    imageElement = new Kinetic.Image
                        image: imageObject
                        x: hotspotElement.get 'x'
                        y: hotspotElement.get 'y'
                        width: hotspotElement.get 'width'
                        height: hotspotElement.get 'height'

                    # @imageLayer.add imageGrp

                    imageGrp = resizeRect imageElement, @imageLayer
                    @_updateDefaultLayer()


                    imageGrp.rotation hotspotElement.get 'angle'

                    @imageLayer.draw()


                    imageGrp.on 'dragend', (e)->
                        hotspotElement.set 'x', imageElement.getAbsolutePosition().x
                        hotspotElement.set 'y', imageElement.getAbsolutePosition().y
                        hotspotElement.set 'width', imageElement.width()
                        hotspotElement.set 'height', imageElement.height()


                    # on click of a text element show properties
                    imageGrp.on 'mousedown ', (e)=>
                        e.stopPropagation()
                        @trigger "show:hotspot:element:properties", hotspotElement


                # on change of model's angle rotate the element
                hotspotElement.on "change:angle", =>
                    imageGrp.rotation hotspotElement.get 'angle'
                    @imageLayer.draw()

                # on change of toDelete property remove the image element from the canvas
                hotspotElement.on "change:toDelete", =>
                    imageGrp.destroy()
                    @imageCollection.remove hotspotElement
                    @trigger "close:hotspot:element:properties"
                    @imageLayer.draw()
                    @_updateDefaultLayer()








            _setBoundRegion: (pos, inner, outer)->
                height = inner.getHeight();
                minX = outer.getX();
                maxX = outer.getX() + outer.getWidth() - inner.getWidth();
                minY = outer.getY();
                maxY = outer.getY() + outer.getHeight() - inner.getHeight();
                X = pos.x;
                Y = pos.y;
                if(X < minX)
                    X = minX

                if(X > maxX)
                    X = maxX

                if(Y < minY)
                    Y = minY

                if(Y > maxY)
                    Y = maxY

                x: X
                y: Y

            updateModel: ->
                @layout.model.set 'content', @_getHotspotData()
                # @layout.model.save() if @layout.model.hasChanged()

                console.log 'updatedmodel             ' + @layout.model

            _getHotspotData: ->
                @stage.toJSON()

			 
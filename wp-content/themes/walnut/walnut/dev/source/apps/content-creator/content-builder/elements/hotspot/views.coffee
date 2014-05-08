define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

		# Menu item view
		class Views.HotspotView extends Marionette.ItemView

			className : 'stage'

			# template : '&nbsp;'

			# events :
				# 'mousedown' : -> @trigger "show:hotspot:elements"
				# 'focus'	: -> console.log "blur" #'updateModel'

			initialize:(opt = {})->
				# get the content if already exists
				if @model.get('content') isnt ''
					@contentObject = JSON.parse @model.get 'content'
				else 
					@contentObject = new Object()
				
				# create layer collections
				@textCollection = App.request "create:new:hotspot:element:collection", @contentObject.textData
				@optionCollection = App.request "create:new:hotspot:element:collection", @contentObject.optionData
				@imageCollection = App.request "create:new:hotspot:element:collection", @contentObject.imageData
				
				#give a unique name to every hotspot canvas
				@stageName = _.uniqueId('stage')

				# create the canvas layers
				@imageLayer = new Kinetic.Layer
					name : 'imageLayer'
				@optionLayer = new Kinetic.Layer
					name : 'optionLayer'
				@textLayer = new Kinetic.Layer
					name : 'textLayer'
				@defaultLayer = new Kinetic.Layer
					name : 'defaultLayer'

			onRender:->

				@$el.attr 'id', @stageName
				

			onShow:()->
				# create a kinetic stage
				@stage = new Kinetic.Stage
						container: @stageName
						width: @$el.parent().width()
						height: @$el.parent().height()+80

				if @contentObject.height isnt undefined
					@stage.height @contentObject.height


				# add the canvas layers
				@stage.add @defaultLayer
				@stage.add @imageLayer
				@stage.add @textLayer
				@stage.add @optionLayer


				@_initializeCanvasResizing()
				

				@$el.parent().parent().on 'click',(evt)=>
					@trigger 'show:hotspot:elements'
					evt.stopPropagation()

				@$el.parent().parent().on 'mousedown',(evt)=>
					@trigger 'close:hotspot:element:properties'
					evt.stopPropagation()

				@_setPropertyBoxCloseHandlers()
				@_drawExistingElements()
				
				#listen to drop event
				# @listenTo @, 'add:hotspot:element' ,(type,elementPos)->

				# 		@_addElements type, elementPos


				# $('button.btn.btn-success.btn-cons2').on 'click',=>
				# 		console.log  @stage.toJSON()


				#make the hotspot canvas area dropable
				@$el.find('.kineticjs-content').droppable
						accept : '.hotspotable'
						drop : (evt, ui)=>
								if ui.draggable.prop("tagName") is 'LI'
										type  = ui.draggable.attr 'data-element'
										elementPos = 
											left : evt.clientX-@$el.find('.kineticjs-content').offset().left
											top  : evt.clientY-@$el.find('.kineticjs-content').offset().top + window.pageYOffset
										@triggerMethod "add:hotspot:element", type , elementPos

			_initializeCanvasResizing:->
				# on resize of the canvas height
				@$el.resize @_setResizeHandler
				# set resize bottom handle
				@$el.resizable
						handles: "s" 

			_setResizeHandler:=>
					# console.log $('#'+@stageName+'.stage').width()
					@stage.setSize
						width: @$el.width()
						height: @$el.height()-5

					@contentObject.height = @stage.height()
					# resize the default image 
					@_updateDefaultImageSize()

			_setPropertyBoxCloseHandlers:->
				$('body').on 'click',=>

							@contentObject.textData = @textCollection.toJSON()
							@contentObject.optionData = @optionCollection.toJSON()
							@contentObject.imageData = @imageCollection.toJSON()
							console.log JSON.stringify @contentObject
						
							@trigger "close:hotspot:elements",@contentObject

							

			
	
			_drawExistingElements:->
				console.log @textCollection
				@textCollection.each (model,i)=>
					# @_addTextElement
					# 		left: model.get 'x'
					# 		top : model.get 'y'
					# 	,	
					# 		model
					@triggerMethod "add:hotspot:element", 
							'Hotspot-Text'
						,
							left: model.get 'x'
							top : model.get 'y'
						,	
							model
				@optionCollection.each (model,i)=>
					if model.get('shape') is 'Rect'
						@_addRectangle
								left : model.get 'x'
								top : model.get 'y'
							,
								model
					if model.get('shape') is 'Circle'
						@_addCircle
								left : model.get 'x'
								top : model.get 'y'
							,
								model

				@imageCollection.each (model,i)=>
					@_addImageElement
							left : model.get 'x'
							top : model.get 'y'
						,
							model.get 'url'
						,
							model

				@_updateDefaultLayer()

				setTimeout ->
					$('body').trigger('mousedown')
				,	1000




			_setDefaultImage:->
				defaultImage = new Image()
				defaultImage.onload = ()=>
						
						@hotspotDefault = new Kinetic.Image
								image 	: defaultImage
						
						@defaultLayer.add @hotspotDefault
						_.delay =>
							@_updateDefaultLayer()
						,500
						@_updateDefaultImageSize()

				defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg"

			# remove the default image from the layer if any hotspot elements are added
			_updateDefaultLayer:->
					i = 1
					isEmptyFlag = true
					while i<@stage.getChildren().length
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
			_updateDefaultImageSize:->
					

					
					if @hotspotDefault

						width = @stage.width()
						height = @stage.height()
						@hotspotDefault.setSize
							width 	: 336
							height 	: 200

						if(width<220)
							@hotspotDefault.setSize
								width : width-10
								height : (width-10)/1.68

						if(height<160)
							@hotspotDefault.setSize
								width : (height-10)*1.68
								height : height-10



						@hotspotDefault.position
							x : @stage.width()/2-@hotspotDefault.width()/2
							y : @stage.height()/2-@hotspotDefault.height()/2

						@defaultLayer.draw()


			onAddHotspotElement: (type,elementPos,model)->

				if(type=="Hotspot-Circle")
						@_addCircle elementPos,model

				else if(type=="Hotspot-Rectangle")
						@_addRectangle elementPos,model

				else if(type == "Hotspot-Text")
						@_addTextElement elementPos,model
				else if(type=="Hotspot-Image")
					# @trigger "show:media:manager"
					App.navigate "media-manager", trigger : true
					@listenTo App.vent,"media:manager:choosed:media",(media)=>
						# @layout.model.set 'image_id', media.get 'id'
						@_addImageElement elementPos, media.toJSON().url
						# @layout.model.save()
						@stopListening App.vent,"media:manager:choosed:media"

					@listenTo App.vent,  "stop:listening:to:media:manager",=>
							@stopListening App.vent, "media:manager:choosed:media"


				@_updateDefaultLayer()

				@optionLayer.draw()


			_addCircle: (elementPos,model)->

					if model
						hotspotElement = model

					else
						modelData =
							type : 'Option'
							shape : 'Circle'
							x : elementPos.left
							y: elementPos.top
							radius : 20
							color : '#000000'
							transparent : false
							correct : false
							
						hotspotElement = App.request "create:new:hotspot:element", modelData
						@optionCollection.add hotspotElement

					self = @

					App.execute "show:hotspot:element:properties",
								model : hotspotElement


					circle = new Kinetic.Circle
							x 			: hotspotElement.get 'x'
							y 			: hotspotElement.get 'y'
							radius 		: hotspotElement.get 'radius'
							stroke 		: hotspotElement.get 'color'
							strokeWidth : 2
							dash 		: [6,4 ]
							dashEnabled : hotspotElement.get 'transparent'
							fill : if hotspotElement.get("correct") then "rgba(12, 199, 55, 0.28)" else ""

					circleGrp = resizeCircle circle,@optionLayer

					circleGrp.on 'dragend',(e)->
							hotspotElement.set 'x',circle.getAbsolutePosition().x
							hotspotElement.set 'y',circle.getAbsolutePosition().y
							hotspotElement.set 'radius',circle.radius()

					# on change of transparency redraw
					hotspotElement.on "change:transparent",=>
						
						circle.dashEnabled hotspotElement.get 'transparent'
						@optionLayer.draw()

					# on change of color redraw
					hotspotElement.on "change:color",=>
						circle.stroke hotspotElement.get 'color'
						@optionLayer.draw()

					# on change of model correct shade the option
					hotspotElement.on "change:correct",=>
						if hotspotElement.get 'correct'
							circle.fill 'rgba(12, 199, 55, 0.28)'
							
						else
							circle.fill ''
							# console.log hotspotElement.get 'correct'
						@optionLayer.draw()

					# delete element based on toDelete
					hotspotElement.on "change:toDelete",=>
							circleGrp.destroy()
							@optionCollection.remove hotspotElement
							App.ContentCreator.closequestionelementproperty = true
							
							App.execute "close:question:element:properties"
							@optionLayer.draw()
							@_updateDefaultLayer()

					# on click of a circle element show properties
					circleGrp.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:hotspot:element:properties",
									model : hotspotElement
							# console.log @

					circleGrp.on 'mouseover',->
						App.ContentCreator.closequestionelementproperty = false

					circleGrp.on 'mouseout',->
						App.ContentCreator.closequestionelementproperty = true

					@optionLayer.draw()


			_addRectangle : (elementPos,model)->

					if model 
						hotspotElement = model

					else
						modelData =
							type : 'Option'
							shape : 'Rect'
							x : elementPos.left
							y: elementPos.top
							width: 30
							height: 30	
							color : '#000000'
							transparent : false
							angle 	: 0
							correct : false
							

						hotspotElement = App.request "create:new:hotspot:element", modelData
						@optionCollection.add hotspotElement


					self = @

					App.execute "show:hotspot:element:properties",
									model : hotspotElement

					box = new Kinetic.Rect
							name : "rect2"
							x: hotspotElement.get 'x'
							y: hotspotElement.get 'y'
							width: hotspotElement.get 'width'
							height: hotspotElement.get 'height'	
							stroke: hotspotElement.get 'color'
							strokeWidth: 2
							dash : [6,4 ]
							dashEnabled : hotspotElement.get 'transparent'	
							fill : if hotspotElement.get("correct") then "rgba(12, 199, 55, 0.28)" else ""

					rectGrp = resizeRect box,@optionLayer

					rectGrp.rotation hotspotElement.get 'angle'

					rectGrp.on 'dragend',(e)->
							hotspotElement.set 'x',box.getAbsolutePosition().x
							hotspotElement.set 'y',box.getAbsolutePosition().y
							hotspotElement.set 'width',box.width()
							hotspotElement.set 'height',box.height()

					# on change of transparency redraw
					hotspotElement.on "change:transparent",=>
						console.log rectGrp
						box.dashEnabled hotspotElement.get 'transparent'
						@optionLayer.draw()

					# on change of color redraw
					hotspotElement.on "change:color",=>
						box.stroke hotspotElement.get 'color'
						@optionLayer.draw()

					# on change of model's angle rotate the element
					hotspotElement.on "change:angle",=>
						rectGrp.rotation hotspotElement.get 'angle'
						@optionLayer.draw()

					# on change of model correct shade the option
					hotspotElement.on "change:correct",=>
						if hotspotElement.get 'correct'
							box.fill 'rgba(12, 199, 55, 0.28)'
							
						else
							box.fill ''
							# console.log hotspotElement.get 'correct'
						@optionLayer.draw()

					# delete element based on toDelete
					hotspotElement.on "change:toDelete",=>
							rectGrp.destroy()
							@optionCollection.remove hotspotElement
							App.ContentCreator.closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@optionLayer.draw()
							@_updateDefaultLayer()

					# on click of a circle element show properties
					rectGrp.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:hotspot:element:properties",
									model : hotspotElement
							# console.log @

					rectGrp.on 'mouseover',->
						App.ContentCreator.closequestionelementproperty = false

					rectGrp.on 'mouseout',->
						App.ContentCreator.closequestionelementproperty = true

					@optionLayer.draw()

					


			_addTextElement: (elementPos,model)->

					if model
						hotspotElement = model

					else
						modelData =
							x: elementPos.left
							y: elementPos.top
							type : 'Text'
							text : ''
							fontFamily : 'Arial'
							fontSize : '14'
							fontColor : '#000000'
							fontBold : ''
							fontItalics : ''
							textAngle : 0

						hotspotElement = App.request "create:new:hotspot:element", modelData
						@textCollection.add hotspotElement

					


					self = @

					App.execute "show:hotspot:element:properties",
									model : hotspotElement

					tooltip = new Kinetic.Label
						x: hotspotElement.get 'x'
						y: hotspotElement.get 'y'
						width : 100
						draggable : true
						dragBoundFunc : (pos)->
							self._setBoundRegion(pos,@,self.stage)

					canvasText = new Kinetic.Text
						text: 'CLICK TO ENTER TEXT'
						opacity : 0.3
						fontFamily: hotspotElement.get 'fontFamily'
						fontSize: hotspotElement.get 'fontSize'
						fill: hotspotElement.get 'fontColor'
						fontStyle : hotspotElement.get('fontBold')+" "+hotspotElement.get('fontItalics')
						padding: 5
						rotation : hotspotElement.get 'textAngle'

					tooltip.on 'dragend',(e)->
							hotspotElement.set 'x',tooltip.getAbsolutePosition().x
							hotspotElement.set 'y',tooltip.getAbsolutePosition().y




					# on click of a text element show properties
					tooltip.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:hotspot:element:properties",
									model : hotspotElement

					# if model text is not empty then change the hotspot text
					if hotspotElement.get('text') != ''
						canvasText.setText hotspotElement.get 'text'
						canvasText.opacity 1
						canvasText.fill hotspotElement.get 'fontColor'

							

					# on change of text update the canvas
					hotspotElement.on "change:text",=>
							if hotspotElement.get('text')!=""
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
					hotspotElement.on "change:fontSize",=>
							canvasText.fontSize hotspotElement.get 'fontSize'
							# tooltip.fire "moverotator"
							@textLayer.draw()


					# on change of font  update the canvas
					hotspotElement.on "change:fontFamily",=>
							canvasText.fontFamily hotspotElement.get 'fontFamily'
							# tooltip.fire "moverotator"
							@textLayer.draw()


					# on change of font Style update the canvas
					hotspotElement.on "change:fontBold change:fontItalics",=>
							canvasText.fontStyle  hotspotElement.get('fontBold')+" "+hotspotElement.get('fontItalics')
							# tooltip.fire "moverotator"
							@textLayer.draw()

					# on change of font color update the canvas
					hotspotElement.on "change:fontColor",=>
							canvasText.fill hotspotElement.get 'fontColor'
							# tooltip.fire "moverotator"
							@textLayer.draw()

					# on change of toDelete property remove the text element from the canvas
					hotspotElement.on "change:toDelete",=>
							tooltip.destroy()
							@textCollection.remove hotspotElement
							App.ContentCreator.closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@textLayer.draw()
							@_updateDefaultLayer()

					# on change of the textAngle prop rotate the text
					hotspotElement.on "change:textAngle",=>
							tooltip.rotation hotspotElement.get 'textAngle'
							@textLayer.draw()

				

					tooltip.on 'mouseover',->
						App.ContentCreator.closequestionelementproperty = false

					tooltip.on 'mouseout',->
						App.ContentCreator.closequestionelementproperty = true

					tooltip.add canvasText

					

					@textLayer.add tooltip

					@textLayer.draw()

			_addImageElement:(elementPos,url,model)->

					if model 
						hotspotElement = model

					else
						modelData =
							type 	: 'Image'						
							x 		: elementPos.left
							y 		: elementPos.top
							width 	: 150
							height 	: 150
							angle 	: 0
							url 	: url

						hotspotElement = App.request "create:new:hotspot:element", modelData
						@imageCollection.add hotspotElement

					imageGrp = null

					imageObject = new Image()
					imageObject.src = hotspotElement.get 'url'
					imageObject.onload = ()=>
							App.execute "show:hotspot:element:properties",
									model : hotspotElement

							imageElement = new Kinetic.Image
									image 	: imageObject
									x 		: hotspotElement.get 'x'
									y 		: hotspotElement.get 'y'
									width 	: hotspotElement.get 'width'
									height 	: hotspotElement.get 'height'

							# @imageLayer.add imageGrp
							
							imageGrp = resizeRect imageElement,@imageLayer
							@_updateDefaultLayer()
							

							imageGrp.rotation hotspotElement.get 'angle'

							@imageLayer.draw()


							imageGrp.on 'dragend',(e)->
								hotspotElement.set 'x',imageElement.getAbsolutePosition().x
								hotspotElement.set 'y',imageElement.getAbsolutePosition().y
								hotspotElement.set 'width',imageElement.width()
								hotspotElement.set 'height',imageElement.height()


							# on click of a text element show properties
							imageGrp.on 'mousedown click',(e)->
									e.stopPropagation()
									App.execute "show:hotspot:element:properties",
											model : hotspotElement
									console.log @

							imageGrp.on 'mouseover',->
								App.ContentCreator.closequestionelementproperty = false

							imageGrp.on 'mouseout',->
								App.ContentCreator.closequestionelementproperty = true
							
					


					# on change of model's angle rotate the element
					hotspotElement.on "change:angle",=>
						imageGrp.rotation hotspotElement.get 'angle'
						@imageLayer.draw()

					# on change of toDelete property remove the image element from the canvas
					hotspotElement.on "change:toDelete",=>
							imageGrp.destroy()
							@imageCollection.remove hotspotElement
							App.ContentCreator.closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@imageLayer.draw()
							@_updateDefaultLayer()


					



					

			_setBoundRegion:(pos,inner,outer)->
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

			updateModel:->
				@layout.model.set 'content', @_getHotspotData()
				# @layout.model.save() if @layout.model.hasChanged()

				console.log 'updatedmodel             '+@layout.model
					 
			_getHotspotData:->

				@stage.toJSON()

			 
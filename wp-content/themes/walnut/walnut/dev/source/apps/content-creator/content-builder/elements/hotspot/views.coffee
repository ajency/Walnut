define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

		closequestionelementproperty = true
		closequestionelements = true

			
		# Menu item view
		class Views.HotspotView extends Marionette.ItemView

			className : 'stage'

			template : '&nbsp;'

			events :
				'mousedown' : -> @trigger "show:hotspot:properties"
				# 'focus'	: -> console.log "blur" #'updateModel'

			initialize:(opt = {})->
				#give a unique name to every hotspot canvas
				# console.log "layout model  "+JSON.stringify @model
				@stageName = "stage"+ new Date().getTime()

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
				# width = @$el.parent().width()
				# @$el.width width	
				console.log "in canvas"


				@stage = new Kinetic.Stage
						container: @stageName
						width: @$el.parent().width()
						height: @$el.parent().height()+80

				
				

				# set image to the default image layer
				@_setDefaultImage()

				# add the canvas layers
				@stage.add @defaultLayer
				@stage.add @imageLayer
				@stage.add @textLayer
				@stage.add @optionLayer


				# on resize
				$('#'+@stageName+'.stage').resize ()=>
					# console.log $('#'+@stageName+'.stage').width()
					@stage.setSize
						width: $('#'+@stageName+'.stage').width()
						height: $('#'+@stageName+'.stage').height()-5
					# resize the default image 
					console.log "Stage resized"
					@_updateDefaultImageSize()

				$('#'+@stageName+'.stage').resizable
						handles: "s" 

				@_setPropertyBoxCloseHandlers()
				
				#listen to drop event
				@listenTo @, 'add:hotspot:element' ,(type,elementPos)->
						if(type=="Hotspot-Image")
							@trigger "show:media:manager"
						else
							@_addElements type, elementPos

						@_updateDefaultLayer()


				# $('button.btn.btn-success.btn-cons2').on 'mouseover',=>
				# 		console.log  @stage.toJSON()


				#make the hotspot canvas area dropable
				$('#'+@stageName+' .kineticjs-content').droppable
						accept : '.hotspotable'
						drop : (evt, ui)=>
								if ui.draggable.prop("tagName") is 'LI'
										type  = ui.draggable.attr 'data-element'
										elementPos = 
											left : evt.clientX-$('#'+@stageName+' .kineticjs-content').offset().left
											top  : evt.clientY-$('#'+@stageName+' .kineticjs-content').offset().top + window.pageYOffset
										@trigger "add:hotspot:element", type , elementPos


			_setPropertyBoxCloseHandlers:->
				$('body').on 'mousedown',->
						if closequestionelementproperty
							# console.log 'stage'
							App.execute "close:question:element:properties"
						if closequestionelements and closequestionelementproperty
							App.execute "close:question:elements"

				$('#question-elements-property').on 'mouseover',->
						closequestionelementproperty =  false
				$('#question-elements-property').on 'mouseout',->
						closequestionelementproperty = true


				$('#'+@stageName+'.stage').on 'mouseenter', '.kineticjs-content', ->
					# console.log 'over stage'
					closequestionelements = false
				$('#'+@stageName+'.stage').on 'mouseleave', '.kineticjs-content', ->
					# console.log 'outofStage'
					closequestionelements = true

				$('#question-elements').on 'mouseover', ->
					# console.log "over question"
					closequestionelements = false
				$('#question-elements').on 'mouseout', ->
					# console.log "out of question"
					closequestionelements = true

	


			_setDefaultImage:->
				defaultImage = new Image()
				defaultImage.onload = ()=>
						console.log "in default image load"
						@hotspotDefault = new Kinetic.Image
								image 	: defaultImage
						
						@defaultLayer.add @hotspotDefault
						@_updateDefaultImageSize()

				defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg"

			# remove the default image from the layer if any hotspot elements are added
			_updateDefaultLayer:->
					i = 1
					while i<@stage.getChildren().length
						if i
							if @stage.getChildren()[i].getChildren().length
								@defaultLayer.removeChildren()
								break;
						i++
					@defaultLayer.draw()

			# update the size of default image on change of stage
			_updateDefaultImageSize:->
					width = @stage.width()
					height = @stage.height()

					console.log width+"  "+height

					if(width<220)
						@hotspotDefault.setSize
							width : width-10
							height : (width-10)/1.4

					if(height<160)
						@hotspotDefault.setSize
							width : (height-10)*1.4
							height : height-10

					@hotspotDefault.position
						x : @stage.width()/2-@hotspotDefault.width()/2
						y : @stage.height()/2-@hotspotDefault.height()/2

					@defaultLayer.draw()


			_addElements: (type,elementPos)->

				if(type=="Hotspot-Circle")
						@_addCircle elementPos

				else if(type=="Hotspot-Rectangle")
						@_addRectangle elementPos

				else if(type == "Hotspot-Text")
						@_addTextElement elementPos

				@optionLayer.draw()


			_addCircle: (elementPos)->

					modelData =
						type : 'Option'
						shape : 'Circle'
						color : '#000000'
						transparent : false
						
					hotspotElement = App.request "create:new:hotspot:element", modelData
					self = @

					App.execute "show:question:element:properties",
									model : hotspotElement


					circle = new Kinetic.Circle
							name : "rect1"
							x: elementPos.left
							y:elementPos.top
							radius :20
							stroke: hotspotElement.get 'color'
							strokeWidth: 2
							dash : [6,4 ]
							dashEnabled : hotspotElement.get 'transparent'

					circleGrp = resizeCircle circle,@optionLayer

					# on change of transparency redraw
					hotspotElement.on "change:transparent",=>
						console.log 'transparent'
						circle.dashEnabled hotspotElement.get 'transparent'
						@optionLayer.draw()

					# on change of color redraw
					hotspotElement.on "change:color",=>
						circle.stroke hotspotElement.get 'color'
						@optionLayer.draw()

					# delete element based on toDelete
					hotspotElement.on "change:toDelete",=>
							circleGrp.destroy()
							closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@optionLayer.draw()

					# on click of a circle element show properties
					circleGrp.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:question:element:properties",
									model : hotspotElement
							# console.log @

					circleGrp.on 'mouseover',->
						closequestionelementproperty = false

					circleGrp.on 'mouseout',->
						closequestionelementproperty = true


			_addRectangle : (elementPos)->

					modelData =
						type : 'Option'
						shape : 'Rect'
						color : '#000000'
						transparent : false
						

					hotspotElement = App.request "create:new:hotspot:element", modelData
					self = @

					App.execute "show:question:element:properties",
									model : hotspotElement

					box = new Kinetic.Rect
							name : "rect2"
							x: elementPos.left
							y:elementPos.top
							width: 25
							height: 25
							stroke: hotspotElement.get 'color'
							strokeWidth: 2
							dash : [6,4 ]
							dashEnabled : hotspotElement.get 'transparent'
							

					rectGrp = resizeRect box,@optionLayer

					# on change of transparency redraw
					hotspotElement.on "change:transparent",=>
						box.dashEnabled hotspotElement.get 'transparent'
						@optionLayer.draw()

					# on change of color redraw
					hotspotElement.on "change:color",=>
						box.stroke hotspotElement.get 'color'
						@optionLayer.draw()

					# delete element based on toDelete
					hotspotElement.on "change:toDelete",=>
							rectGrp.destroy()
							closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@optionLayer.draw()

					# on click of a circle element show properties
					rectGrp.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:question:element:properties",
									model : hotspotElement
							# console.log @

					rectGrp.on 'mouseover',->
						closequestionelementproperty = false

					rectGrp.on 'mouseout',->
						closequestionelementproperty = true

					


			_addTextElement: (elementPos)->

					modelData =
						type : 'Text'
						text : ''
						fontFamily : 'Arial'
						fontSize : '14'
						fontColor : '#000000'
						fontBold : ''
						fontItalics : ''
						textAngle : 0

					hotspotElement = App.request "create:new:hotspot:element", modelData
					self = @

					App.execute "show:question:element:properties",
									model : hotspotElement

					tooltip = new Kinetic.Label
						x: elementPos.left
						y: elementPos.top
						width : 100
						draggable : true
						dragBoundFunc : (pos)->
							self._setBoundRegion(pos,@,self.stage)

					canvasText = new Kinetic.Text
						text: 'Enter Text'
						fontFamily: hotspotElement.get 'fontFamily'
						fontSize: hotspotElement.get 'fontSize'
						fill: hotspotElement.get 'fontColor'
						fontStyle : hotspotElement.get('fontBold')+" "+hotspotElement.get('fontItalics')
						padding: 5


					rotator = new Kinetic.Circle
						x : canvasText.width()
						y : 0 
						stroke : 'black'
						radius: 5
						draggable : true
					


					# on click of a text element show properties
					tooltip.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:question:element:properties",
									model : hotspotElement
							console.log @

					# on change of text update the canvas
					hotspotElement.on "change:text",=>
							if hotspotElement.get('text')!=""
								canvasText.setText hotspotElement.get 'text'
							else
								canvasText.setText 'Enter Text'
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
							closequestionelementproperty = true
							App.execute "close:question:element:properties"
							@textLayer.draw()

					# on change of the textAngle prop rotate the text
					hotspotElement.on "change:textAngle",=>
							tooltip.rotation hotspotElement.get 'textAngle'
							console.log tooltip.rotation()
							@textLayer.draw()

					# tooltip.on 'moverotator',(e)->
					# 	rotator.x tooltip.width()


					tooltip.on 'mouseover',->
						closequestionelementproperty = false

					tooltip.on 'mouseout',->
						closequestionelementproperty = true

					tooltip.add canvasText

					# tooltip.add rotator

					# rotateLabel tooltip,rotator,@textLayer

					@textLayer.add tooltip

					@textLayer.draw()

					

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

			 
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
				'click' : -> @trigger "show:hotspot:properties"
				# 'focus'	: -> console.log "blur" #'updateModel'

			initialize:(opt = {})->
				#give a unique name to every hotspot canvas
				# console.log "layout model  "+JSON.stringify @model
				@stageName = "stage"+ new Date().getTime()

			onRender:->

				@$el.attr 'id', @stageName
				

			onShow:()->
				# width = @$el.parent().width()
				# @$el.width width	
				console.log "in canvas"


				@stage = new Kinetic.Stage
						container: @stageName
						width: @$el.parent().width()-15
						height: @$el.parent().height()+80

				#create and add the canvas layers
				@imageLayer = new Kinetic.Layer
				@optionLayer = new Kinetic.Layer
				@textLayer = new Kinetic.Layer
				@defaultLayer = new Kinetic.Layer

				# set image to the default image layer
				@_setDefaultImage()

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

				$('body').on 'click',->
						if closequestionelementproperty
							console.log 'stage'
							App.execute "close:question:element:properties"
						if closequestionelements and closequestionelementproperty
							App.execute "close:question:elements"

				$('#question-elements-property').on 'mouseover',->
						closequestionelementproperty =  false
				$('#question-elements-property').on 'mouseout',->
						closequestionelementproperty = true


				$('#'+@stageName+'.stage').on 'mouseenter', '.kineticjs-content', ->
					console.log 'over stage'
					closequestionelements = false
				$('#'+@stageName+'.stage').on 'mouseleave', '.kineticjs-content', ->
					console.log 'outofStage'
					closequestionelements = true

				$('#question-elements').on 'mouseover', ->
					console.log "over question"
					closequestionelements = false
				$('#question-elements').on 'mouseout', ->
					console.log "out of question"
					closequestionelements = true

				$('body').on 'click',=>
					




						

				#listen to drop event
				@listenTo @, 'add:hotspot:element' ,(type,elementPos)->
						if(type=="Hotspot-Image")
							@trigger "show:media:manager"
						else
							@_addElements type, elementPos

						@_updateDefaultLayer()


				$('button.btn.btn-success.btn-cons2').on 'mouseover',=>
						console.log  @stage.toJSON()


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




			_setDefaultImage:->
				defaultImage = new Image()
				defaultImage.onload = ()=>
						console.log "in default image load"
						@hotspotDefault = new Kinetic.Image
								# x		: @stage.width()/2-70
								# y		: @stage.height()/2-50
								# width 	: 210
								# height	: 150
								image 	: defaultImage

						@_updateDefaultImageSize()
						@defaultLayer.add @hotspotDefault
						@defaultLayer.draw()


				defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg"

			# remove the default image from the layer if any hotspot elements are added
			_updateDefaultLayer:->
				
					i = 1
					while i<@stage.getChildren().length
						if i
							if @stage.getChildren()[i].getChildren().length
								@defaultLayer.remove @hotspotElement
								break;
							console.log @stage.getChildren()[i]

						i++

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


			_addElements: (type,elementPos)->

				if(type=="Hotspot-Circle")
						@_addCircle elementPos

				else if(type=="Hotspot-Rectangle")
						@_addRectangle elementPos

				else if(type == "Hotspot-Text")
						@_addTextElement elementPos

				@optionLayer.draw()


			_addCircle: (elementPos)->
					circle = new Kinetic.Circle
							name : "rect1"
							x: elementPos.left
							y:elementPos.top
							radius :20
							stroke: 'black'
							strokeWidth: 4

					resizeCircle circle,@optionLayer


			_addRectangle : (elementPos)->

					box = new Kinetic.Rect
							name : "rect2"
							x: elementPos.left
							y:elementPos.top
							width: 25
							height: 25
							stroke: 'black'
							strokeWidth: 4
							

					resizeRect box,@optionLayer

					


			_addTextElement: (elementPos)->

					modelData =
						type : 'Text'
						text : ''
						fontFamily : 'Arial'
						fontSize : '14'
						fontColor : 'black'
						fontBold : ''
						fontItalics : ''

					hotspotElement = App.request "create:new:hotspot:element", modelData

					tooltip = new Kinetic.Label
						x: elementPos.left
						y: elementPos.top
						width : 100
						draggable : true

					canvasText = new Kinetic.Text
						text: 'Enter Text'
						fontFamily: hotspotElement.get 'fontFamily'
						fontSize: hotspotElement.get 'fontSize'
						fill: hotspotElement.get 'fontColor'
						fontStyle : hotspotElement.get('fontBold')+" "+hotspotElement.get('fontItalics')
						padding: 5

					# on click of a text element show properties
					tooltip.on 'mousedown click',(e)->
							e.stopPropagation()
							App.execute "show:question:element:properties",
									model : hotspotElement

					# on change of text update the canvas
					hotspotElement.on "change:text",=>
							if hotspotElement.get('text')!=""
								canvasText.setText hotspotElement.get 'text'
							else
								canvasText.setText 'Enter Text'
							@textLayer.draw()

					# on change of font Size update the canvas
					hotspotElement.on "change:fontSize",=>
							canvasText.fontSize hotspotElement.get 'fontSize'
							@textLayer.draw()


					# on change of font  update the canvas
					hotspotElement.on "change:fontFamily",=>
							canvasText.fontFamily hotspotElement.get 'fontFamily'
							@textLayer.draw()


					# on change of font Style update the canvas
					hotspotElement.on "change:fontBold change:fontItalics",=>
							canvasText.fontStyle  hotspotElement.get('fontBold')+" "+hotspotElement.get('fontItalics')
							@textLayer.draw()


					tooltip.on 'mouseover',->
						closequestionelementproperty = false

					tooltip.on 'mouseout',->
						closequestionelementproperty = true

					

					tooltip.add canvasText

					@textLayer.add tooltip

					@textLayer.draw()

					




			updateModel:->
				@layout.model.set 'content', @_getHotspotData()
				# @layout.model.save() if @layout.model.hasChanged()

				console.log 'updatedmodel             '+@layout.model
					 
			_getHotspotData:->

				@stage.toJSON()

			      		



				
		
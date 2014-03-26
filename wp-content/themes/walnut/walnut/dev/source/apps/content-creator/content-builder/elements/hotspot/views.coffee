define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

		
			
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


				# on resize
				$('#'+@stageName+'.stage').resize ()=>
					# console.log $('#'+@stageName+'.stage').width()
					@stage.setSize
						width: $('#'+@stageName+'.stage').width()
						height: $('#'+@stageName+'.stage').height()-5

					@_updateDefaultImageSize()

				$('#'+@stageName+'.stage').resizable
						 handles: "s" 
						
				
							
					
				#create and add the canvas layers
				@imageLayer = new Kinetic.Layer
				@optionLayer = new Kinetic.Layer
				@defaultLayer = new Kinetic.Layer

				@stage.add @defaultLayer
				@stage.add @imageLayer
				@stage.add @optionLayer

				@_setDefaultImage()

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
								x		: @stage.width()/2-70
								y		: @stage.height()/2-50
								width 	: 140
								height	: 100
								image 	: defaultImage

						@defaultLayer.add @hotspotDefault
						@defaultLayer.draw()

				defaultImage.src = "../wp-content/themes/walnut/images/empty-hotspot.svg"

			_updateDefaultLayer:->
					if(@stage.getChildren()[2].getChildren().length || @stage.getChildren()[1].getChildren().length)
						@defaultLayer.remove @hotspotDefault

			_updateDefaultImageSize:->
					@hotspotDefault.position
						x : @stage.width()/2-70
						y : @stage.height()/2-50


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

			_addTextElement : (elementPos)->
					@layer = new Kinetic.Layer
							draggable : true

					rec = new Kinetic.Rect
						x: elementPos.left
						y: elementPos.top
						width:100
						height:100
						strokeWidth : 1
						stroke: 'black'

					newText = new Kinetic.EditableText
							# find click position.
							x: elementPos.left+5
							y: elementPos.top+5
							text: ''
							 # following params can be modified, or left blank (defaults are in kinetic.editable.js)
							# lineHeight: 1.3,
							fontSize: 29
							# focusRectColor: "black",
							fontFamily: 'Courier'
							fill: '#000000'
							
							 # ALWAYS provide the focus layer and stage. pasteModal id to support ctrl+v paste.
							focusLayer: @layer
							stage: @stage
							pasteModal: "pasteModalArea"
							
							
							
							# drawHitFunc: (canvaas)->
							# 	context = canvaas.getContext()
							# 	width = 100
							# 	height = 20
									
							# 	if (this.tempText != undefined) 
							# 		linesCount = this.tempText.length
									
							# 		context.beginPath()
							# 		context.rect(0, 0, this.maxWidth + 10, linesCount*height)
							# 		context.closePath()
							# 		canvaas.fillStroke(this)
								
							# 	else 
							# 		context.beginPath()
							# 		context.rect(0, 0, width, height)
							# 		context.closePath()
							# 		canvaas.fillStroke(this)
							
								
					
						
					newText.on 'change',->
						console.log "change"
					
					
					@layer.add rec
					@layer.add newText
					@stage.add @layer

					hoverontext = false;
				
					@layer.on 'click', ()=>
						if not hoverontext
							hoverontext = true
							document.body.style.cursor = 'pointer';
							console.log 'focus'
							console.log @layer
							newText.focus(@layer)

					@layer.on 'dblclick', (e)=>
						if(hoverontext)
						    hoverontext = false
							document.body.style.cursor = 'default';
							console.log 'unfocus'
							console.log @layer
							newText.unfocus(e)
							@layer.draw()

			
					
					



			updateModel:->
				@layout.model.set 'content', @_getHotspotData()
				# @layout.model.save() if @layout.model.hasChanged()

				console.log 'updatedmodel             '+@layout.model
					 
			_getHotspotData:->

				@stage.toJSON()

			      		



				
		
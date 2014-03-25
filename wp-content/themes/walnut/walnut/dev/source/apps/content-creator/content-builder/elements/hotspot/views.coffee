define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

		
			
		# Menu item view
		class Views.HotspotView extends Marionette.ItemView

			className : 'stage'

			template : '&nbsp;'

			initialize:(opt = {})->
				#give a unique name to every hotspot canvas
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


				$('#'+@stageName+'.stage').resize ()=>
					console.log $('#'+@stageName+'.stage').width()
					@stage.setSize
						width: $('#'+@stageName+'.stage').width()
						height: $('#'+@stageName+'.stage').height()-5

				$('#'+@stageName+'.stage').resizable
						 handles: "s" 
						
				
							
					

				@imageLayer = new Kinetic.Layer
				@optionLayer = new Kinetic.Layer

				@stage.add @imageLayer
				@stage.add @optionLayer

				@listenTo @, 'add:hotspot:element' ,(type,elementPos)->

						if(type=="Image")
							@trigger "show:media:manager"

						@_addShapes type, elementPos


				$('#'+@stageName+' .kineticjs-content').droppable
						accept : '.hotspotable'
						drop : (evt, ui)=>
								if ui.draggable.prop("tagName") is 'LI'
										type  = ui.draggable.attr 'data-element'
										elementPos = 
											left : evt.clientX-$('#'+@stageName+' .kineticjs-content').offset().left
											top  : evt.clientY-$('#'+@stageName+' .kineticjs-content').offset().top + window.pageYOffset
										@trigger "add:hotspot:element", type , elementPos


			_addShapes: (type,elementPos)->

				if(type=="Hotspot-Circle")
						circle = new Kinetic.Circle
							name : "rect1"
							x: elementPos.left
							y:elementPos.top
							radius :20
							stroke: 'black'
							strokeWidth: 4
							

						resizeCircle circle,@optionLayer

				else if(type=="Hotspot-Rectangle")
						box = new Kinetic.Rect
							name : "rect2"
							x: elementPos.left
							y:elementPos.top
							width: 25
							height: 25
							stroke: 'black'
							strokeWidth: 4

						resizeRect box,@optionLayer

				@optionLayer.draw()
					       
			      		



				
		
define ['app'],(App)->

	# Row views
	App.module 'ContentCreator.ContentBuilder.Element.Hotspot.Views', (Views, App, Backbone, Marionette, $, _)->

		
			
		# Menu item view
		class Views.HotspotView extends Marionette.ItemView

			className : 'stage'

			template : '&nbsp;'

			initialize:(opt = {})->

			onRender:->

				@$el.attr 'id','stage'
				

			onShow:()->	
				@stage = new Kinetic.Stage
								container: 'stage'
								width: 300
								height: 500

				@imageLayer = new Kinetic.Layer
				@optionLayer = new Kinetic.Layer

				@stage.add @imageLayer
				@stage.add @optionLayer

				@listenTo @, 'add:hotspot:element' ,(type)->
						@_addShapes type


				$('.stage .kineticjs-content').droppable
						drop : (evt, ui)=>
								if ui.draggable.prop("tagName") is 'LI'
										type  = ui.draggable.attr 'data-element'
										@trigger "add:hotspot:element", type


			_addShapes: (type)->

				if(type=="Hotspot-Circle")
						console.log type
						box = new Kinetic.Circle
							name : "rect1",
							x: 100,
							y:100,

							radius :20
							stroke: 'black',
							strokeWidth: 4,
							draggable: true,

						@optionLayer.add box

				else if(type=="Hotspot-Rectangle")
						box = new Kinetic.Rect
							name : "rect1",
							x: 10,
							y:15,

							width: 25,
							height: 25,
							stroke: 'black',
							strokeWidth: 4,
							draggable: true,

						@optionLayer.add box

				@optionLayer.draw()
					       
			      		



				
		
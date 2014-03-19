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
								height: 400


				@layer = new Kinetic.Layer
							width : 100

				

				@stage.add @layer
				# @stage.scaleX(0.5)
				# @layer.scaleX 2

				# @layer.draw()

				# @stage.draw()
				
		
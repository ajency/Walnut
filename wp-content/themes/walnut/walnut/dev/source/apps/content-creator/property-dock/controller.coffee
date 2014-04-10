define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/views'
		'apps/content-creator/property-dock/question-element-box-loader'],(App,RegionController)->

			App.module "ContentCreator.PropertyDock" ,(PropertyDock, App, Backbone, Marionette, $, _)->

				

				class PropertyDockController extends RegionController

					initialize: (options)->

						@layout = @_getLayout()

						

						App.commands.setHandler "show:question:elements",(options)=>

								@_getElementBox options.model

						App.commands.setHandler "show:question:properties",(options)=>
								@_getElementProperties options.model

						# show hotspot element properties
						App.commands.setHandler "show:hotspot:element:properties",(options)=>
								@_getHotspotElementProperties options.model

						App.commands.setHandler "close:question:element:properties",=>
								@layout.questElementPropRegion.close()

						App.commands.setHandler "close:question:elements",=>
								@layout.questElementRegion.close()

						@show @layout

						

					_getLayout: ->
						new PropertyDock.Views.Layout

					
						

					_getElementBox:(model)->
						elementName = model.get('element')
						ele = _.slugify(elementName)
						App.execute "show:#{ele}:elements",
								region : @layout.questElementRegion
								model : model

					_getHotspotElementProperties:(model)->
						
						App.execute "show:hotspot:element:properties:box",
								region : @layout.questElementPropRegion
								model : model

					_getElementProperties:(model)->
						elementName = model.get 'element'
						ele = _.slugify elementName
						App.execute "show:#{ele}:properties",
								region : @layout.questPropertyRegion
								model : model

				
				App.commands.setHandler "show:property:dock",(options)->

						new PropertyDockController
								region : options.region
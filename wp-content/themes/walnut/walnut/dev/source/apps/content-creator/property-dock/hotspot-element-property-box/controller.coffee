define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/hotspot-element-property-box/hotspot-element-property-view-loader'],
			(App,RegionController)->

				App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox",
				(HotspotElementPropertyBox, App, Backbone, MArionette, $, _)->

					class HotspotElementPropertyBoxController extends RegionController

						initialize:(options)->

							

							@view = @_getView(options)

							@show @view

						_getView:(options)->
							elementType = options.model.get 'type'
							viewName = "#{elementType}View"
							# console.log viewName
							new HotspotElementPropertyBox.Views[viewName]
									model : options.model
									hotspotModel : options.hotspotModel


					App.commands.setHandler "show:hotspot:element:properties:box",(options)->

							new HotspotElementPropertyBoxController 
									region : options.region
									model : options.model
									hotspotModel : options.hotspotModel

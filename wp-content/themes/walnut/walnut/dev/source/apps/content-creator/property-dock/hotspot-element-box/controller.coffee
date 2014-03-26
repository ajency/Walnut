define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/hotspot-element-box/views'
		],(App,RegionController)->

			App.module "ContentCreator.PropertyDock.HotspotElementBox",
				(HotspotElementBox, App, Backbone, Marionette, $, _)->


					class HotspotElementBoxController extends RegionController

						initialize :(options)->

							@view = @_getView()


							@show @view

						_getView : ->

							new HotspotElementBox.Views.HotspotElementBoxView
								collection : App.request "get:all:hotspot:elements"


					App.commands.setHandler "show:hotspot:elements",(options)->
							new HotspotElementBoxController 
									region : options.region

define ['app'
		'controllers/region-controller'],(App,RegionController)->

			App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox",
				(HotspotElementPropertyBox, App, Backbone, MArionette, $, _)->

					class HotspotElementPropertyBoxController extends RegionController

						initialize:->




					App.commands.setHandler "show:hotspot:properties:box",(options)->

							new HotspotElementPropertyBoxController 
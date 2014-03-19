define ['app'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/hotspot-properties/controller'],(App,Element)->

			App.module "ContentCreator.ContentBuilder.Element.Hotspot",(Hotspot, App, Backbone, Marionette, $, _)->

				class Hotspot.Controller extends Element.Controller

					initialize : (options)->

						console.log "in hotspot"

						# App.execute "show:hotspot:properties",
						# 		region : App.ContentCreator.ContentCreatorLayout.HotspotPropertiesRegion

						@stage = new Kinetic.Stage
					        	container: 'myCanvas'
					        	width: 600
					        	height: 400


						super(options)
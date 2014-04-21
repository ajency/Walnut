define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/fib-element-property-box/views'],
			(App,RegionController)->

				App.module "ContentCreator.PropertyDock.FibElementPropertyBox",
				(FibElementPropertyBox, App, Backbone, MArionette, $, _)->

					class FibElementPropertyBox.Controller extends RegionController

						initialize:(options)->

							@view = @_getView(options.model)

							@show @view

						_getView:(model)->

							new FibElementPropertyBox.Views.BlankElementView
									model : model


					App.commands.setHandler "show:fib:element:properties:box",(options)->

							new FibElementPropertyBox.Controller 
									region : options.region
									model : options.model
define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/fib-property-box/views']
		,(App,RegionController)->

			App.module "ContentCreator.PropertyDock.FibPropertyBox",
			(FibPropertyBox, App, Backbone, Marionette, $, _)->

				class FibPropertyBox.Controller extends RegionController

					initialize : (options)->

						@model = options.model
						
						# get property view
						@layout = @_getView @model

						# show view
						@show @layout

					_getView:(model)->
						new FibPropertyBox.Views.PropertyView
								model : model

				App.commands.setHandler "show:fib:properties",(options)->
						new FibPropertyBox.Controller
								region : options.region
								model : options.model
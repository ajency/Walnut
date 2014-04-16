define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/sort-property-box/views']
		,(App,RegionController)->

			App.module "ContentCreator.PropertyDock.SortPropertyBox",
			(SortPropertyBox, App, Backbone, Marionette, $, _)->

				class SortPropertyBox.Controller extends RegionController

					initialize : (options)->

						@model = options.model
						
						@view = @_getView @model

						@show @view

					_getView:(model)->

						new SortPropertyBox.Views.PropertyView
								model : model



					onClose:->
						localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())


				App.commands.setHandler "show:sort:properties",(options)->
					new SortPropertyBox.Controller
							region : options.region
							model : options.model
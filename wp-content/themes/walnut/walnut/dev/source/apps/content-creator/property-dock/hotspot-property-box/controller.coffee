define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/hotspot-property-box/view']
		,(App,RegionController)->

			App.module "ContentCreator.PropertyDock.HotspotPropertyBox",
			(HotspotPropertyBox, App, Backbone, Marionette, $, _)->

				class HotspotPropertyBox.Controller extends RegionController

					initialize : (options)->

						@model = options.model
						
						# get property view
						@layout = @_getView @model

						# show view
						@show @layout

					# function to get the property view
					_getView:(model)->
						new HotspotPropertyBox.Views.PropertyView
								model : model

					# on close of property box save the model
					onClose:->
						# localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())
						# if @model.hasChanged()
							App.execute "save:hotspot:content"
							localStorage.setItem 'ele'+@model.get('meta_id'), JSON.stringify(@model.toJSON())
							# console.log JSON.stringify @model.toJSON()


				App.commands.setHandler "show:hotspot:properties",(options)->
						new HotspotPropertyBox.Controller
								region : options.region
								model : options.model
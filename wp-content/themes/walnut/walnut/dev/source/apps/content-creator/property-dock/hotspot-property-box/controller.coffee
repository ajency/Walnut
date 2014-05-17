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
						App.execute "save:hotspot:content"
						console.log @model
						
						collection_types= ['option','image','text']
						
						optionCollection= this.model.get('optionCollection').models

						optionModels= _.map optionCollection, (m)-> m.toJSON()

						@model.set 'optionCollection': optionModels

						imageCollection= this.model.get('imageCollection').models

						imageModels= _.map imageCollection, (m)-> m.toJSON()

						@model.set 'imageCollection': imageModels
						
						textCollection= this.model.get('textCollection').models

						textModels= _.map textCollection, (m)-> m.toJSON()

						@model.set 'textCollection': textModels

						@model.save()

						optionCollection = App.request "create:new:option:collection", optionCollection
						imageCollection = App.request "create:new:option:collection", imageCollection
						textCollection = App.request "create:new:option:collection", textCollection
						
						@model.set 
							'optionCollection': optionCollection
							'imageCollection': imageCollection
							'textCollection': textCollection


				App.commands.setHandler "show:hotspot:properties",(options)->
						new HotspotPropertyBox.Controller
								region : options.region
								model : options.model
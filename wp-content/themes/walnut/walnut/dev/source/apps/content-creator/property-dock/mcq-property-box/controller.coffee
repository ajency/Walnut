define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/mcq-property-box/views'
		],(App,RegionController)->

			App.module "ContentCreator.PropertyDock.McqPropertyBox",
			(McqPropertyBox, App, Backbone, Marionette, $, _)->

				class McqPropertyBox.Controller extends RegionController

					initialize : (options)->

						@model = options.model
						

						@layout = @_getView @model

						@listenTo @layout,"change:option:number",(number)=>
							@model.set 'optioncount',parseInt number
							console.log @model

						@show @layout

					_getView:(model)->

						new McqPropertyBox.Views.PropertyView
								model : model





				App.commands.setHandler "show:mcq:properties",(options)->
					new McqPropertyBox.Controller
							region : options.region
							model : options.model
define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/views'
		'apps/content-creator/property-dock/question-element-box-loader'],(App,RegionController)->

			App.module "ContentCreator.PropertyDock" ,(PropertyDock, App, Backbone, Marionette, $, _)->

				class PropertyDockController extends RegionController

					initialize: (options)->

						@layout = @_getLayout()

						App.commands.setHandler "show:question:elements",(options)=>
								@_getElementBox options.model

						App.commands.setHandler "show:question:element:properties",(options)=>
								@_getElementProperties options.model

						@show @layout

					_getLayout: ->
						new PropertyDock.Views.Layout

					_getElementBox:(model)->
						elementName = model.get('element')
						ele = _.slugify(elementName)
						App.execute "show:#{ele}:elements",
								region : @layout.questElementRegion
								model : model

					_getElementProperties:(model)->
						elementFamily = model.get 'family'
						App.execute "show:#{elementFamily}:properties:box",
								region : @layout.questElementPropRegion
								model : model

				App.commands.setHandler "show:property:dock",(options)->

						new PropertyDockController
								region : options.region
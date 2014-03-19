define ['app'
		'controllers/region-controller'
		'apps/content-creator/property-dock/views'
		'apps/content-creator/property-dock/question-element-box-loader'],(App,RegionController)->

			App.module "ContentCreator.PropertyDock" ,(PropertyDock, App, Backbone, Marionette, $, _)->

				class PropertyDockController extends RegionController

					initialize: (options)->

						@layout = @_getLayout()

						App.commands.setHandler "show:question:elements",(options)=>
							  @_getElementBox options.model.get('element')

						@show @layout

					_getLayout: ->
						new PropertyDock.Views.Layout

					_getElementBox:(model)


				App.commands.setHandler "show:property:dock",(options)->

						new PropertyDockController
								region : options.region
define ['app'
		'controllers/region-controller'
		'apps/content-creator/element-box/view'
		
		],(App,RegionController)->

			
			App.module "ContentCreator.ElementBox", (ElementBox,App, Backbone, Marionette, $, _)->	

				class ElementBoxController extends RegionController

					initialize : (options)->

						elementsCollection = App.request "get:elementbox:elements"
						# get the main view for the element box
						@view = @_getElementBoxView(elementsCollection)

						# show the view
						@show @view

					_getElementBoxView:(elementsCollection)->
						
						new ElementBox.Views.ElementBoxView
									collection : elementsCollection



				

				# create a command handler to start the element box controller
				App.commands.setHandler "show:element:box", (options)->
								new ElementBoxController
											region : options.region
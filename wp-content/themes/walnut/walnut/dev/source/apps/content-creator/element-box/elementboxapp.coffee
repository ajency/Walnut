define ['app'
		'controllers/region-controller'
		'apps/content-creator/element-box/view'
		
		],(App,RegionController)->

			
			App.module "ContentCreator.ElementBox", (ElementBox,App)->	

				class ElementBoxController extends RegionController

					initialize : (options)->

						elementsCollection = App.request "get:elementbox:elements"
						# get the main view for the content creator
						@view = @_getElementBoxView(elementsCollection)

						# show the view
						@show @view

					_getElementBoxView:(elementsCollection)->
						
						new ElementBox.Views.ElementBoxView
									collection : elementsCollection



				

				# create a command handler to start the content creator controller
				App.commands.setHandler "show:element:box", (options)->
								new ElementBoxController
											region : options.region
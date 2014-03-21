define ['app'
		'controllers/region-controller'
		'apps/content-creator/content-builder/view'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements-loader'
		'apps/content-creator/content-builder/autosave/controller'],(App,RegionController)->

			App.module "ContentCreator.ContentBuilder", (ContentBuilder, App, Backbone, Marionette, $, _)->

				class ContentBuilderController extends RegionController

					initialize : (options)->

						@view = @_getContentBuilderView()

						@listenTo @view, "add:new:element", (container, type)->
									App.request "add:new:element", container, type
									# console.log "new element of type "+type

						@show @view

					_getContentBuilderView : ()->

						new ContentBuilder.Views.ContentBuilderView

				API = 
					# add a new element to the builder region
					addNewElement : (container , type, modelData)->

						new ContentBuilder.Element[type].Controller
										container : container
										modelData : modelData

					saveQuestion :->

						autoSave = new ContentBuilder.AutoSave.Controller
						autoSave.autoSave()


				# create a command handler to start the content builder controller
				App.commands.setHandler "show:content:builder", (options)->
								new ContentBuilderController
											region : options.region

				#Request handler for new element
				App.reqres.setHandler "add:new:element" , (container, type, modelData = {})->

						API.addNewElement container, type, modelData


				App.commands.setHandler "save:question",->
						API.saveQuestion()
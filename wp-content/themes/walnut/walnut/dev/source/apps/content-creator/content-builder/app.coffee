define ['app'
		'controllers/region-controller'
		'apps/content-creator/content-builder/view'
		'apps/content-creator/content-builder/element/controller'
		'apps/content-creator/content-builder/elements-loader'
		'apps/content-creator/content-builder/autosave/controller'],(App,RegionController)->

			App.module "ContentCreator.ContentBuilder", (ContentBuilder, App, Backbone, Marionette, $, _)->

				
				class ContentBuilderController extends RegionController

					initialize : (options)->

						{eventObj} = options

						elements = App.request "get:page:json"



						@view = @_getContentBuilderView elements

						

						@listenTo @view, "add:new:element", (container, type)->
									App.request "add:new:element", container, type , eventObj

						@listenTo @view, "dependencies:fetched", =>
								_.delay =>
									@startFillingElements eventObj
								, 400

						@show @view,
							loading : true

					_getContentBuilderView : (elements)->

						new ContentBuilder.Views.ContentBuilderView
								model : elements

					_getContainer :(section)->
						
							$('#myCanvas')
						


					# start filling elements
					startFillingElements: (eventObj)->
						section = @view.model.toJSON()

						container = $('#myCanvas')
						_.each section, (element, i)=>
							if element.element is 'Row'
								@addNestedElements container,element, eventObj
							else
								App.request "add:new:element",container,element.element,eventObj, element

					
					addNestedElements:(container,element,eventObj)->
						controller = App.request "add:new:element",container,element.element, element
						console.log element.elements
						_.each element.elements, (column, index)=>
							
							return if column.elements.length is 0
							container = controller.layout.elementRegion.currentView.$el.children().eq(index)
							_.each column.elements,(ele, i)=>
								if ele.element is 'Row'
									@addNestedElements $(container),ele,eventObj
								else
									App.request "add:new:element",container,ele.element,eventObj, ele




				API = 
					# add a new element to the builder region
					addNewElement : (container , type, modelData, eventObj)->
						console.log type
						
						new ContentBuilder.Element[type].Controller
										container : container
										modelData : modelData
										eventObj : eventObj

					saveQuestion :->

						autoSave = App.request "autosave:question:layout"
						autoSave.autoSave()


				# create a command handler to start the content builder controller
				App.commands.setHandler "show:content:builder", (options)->
								new ContentBuilderController options

				#Request handler for new element
				App.reqres.setHandler "add:new:element" , (container, type,eventObj, modelData = {})->

						API.addNewElement container, type, modelData , eventObj


				App.commands.setHandler "save:question",->
						API.saveQuestion()
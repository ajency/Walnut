define ['app'
		'controllers/region-controller'
		'apps/content-preview/content-board/element/controller'
		'apps/content-preview/content-board/view'
		'apps/content-preview/content-board/elements-loader'
		],(App,RegionController)->

			App.module "ContentPreview.ContentBoard", (ContentBoard, App, Backbone, Marionette, $, _)->


				class ContentBoard.Controller extends RegionController

					initialize:(options)->

						elements = App.request "get:page:json"

						answerData =
								marks	: 0
								total	: 0
						

						@view = @_getContentBoardView elements

						@listenTo @view, "add:new:element", (container, type)->
								App.request "add:new:element", container, type 

						@listenTo @view, 'dependencies:fetched',=>
								_.delay =>
										@startFillingElements()
								, 400

						triggerOnce = _.once _.bind @triggerShowResponse, @,answerData

						App.commands.setHandler "show:response",(marks,total)=>
							answerData.marks += parseInt marks
							answerData.total += parseInt total
							triggerOnce()

						@show @view,
							loading : true

					triggerShowResponse:(answerData)=>
						_.delay =>
							@view.triggerMethod 'show:response',answerData.marks,answerData.total
						,500

					_getContentBoardView:(model)->
						new ContentBoard.Views.ContentBoardView
							model : model

					# start filling elements
					startFillingElements: ()->
						section = @view.model.toJSON()

						container = $('#myCanvas #question-area')
						_.each section, (element, i)=>
							if element.element is 'Row'
								@addNestedElements container,element
							else
								App.request "add:new:element",container,element.element, element

					
					addNestedElements:(container,element)->
						controller = App.request "add:new:element",container,element.element, element
						_.each element.elements, (column, index)=>
							return if column.elements.length is 0
							container = controller.layout.elementRegion.currentView.$el.children().eq(index)
							_.each column.elements,(ele, i)=>
								if ele.element is 'Row'
									@addNestedElements $(container),ele
								else
									App.request "add:new:element",container,ele.element, ele


				API = 
					# add a new element to the builder region
					addNewElement : (container , type, modelData)->
						console.log type
						
						new ContentBoard.Element[type].Controller
										container : container
										modelData : modelData


				App.commands.setHandler 'show:content:board',(options)->
					new ContentBoard.Controller options

				#Request handler for new element
				App.reqres.setHandler "add:new:element" , (container, type, modelData = {})->
						API.addNewElement container, type, modelData 

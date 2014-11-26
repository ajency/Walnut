define ['app'
		'controllers/region-controller'
		'apps/content-board/element/controller'
		'apps/content-board/view'
		'apps/content-board/elements-loader'
], (App, RegionController)->

	#used for preview of content pieces and taking of quiz/teaching-module
	
	App.module "ContentPreview.ContentBoard", (ContentBoard, App, Backbone, Marionette, $, _)->
		class ContentBoard.Controller extends RegionController

			answerWreqrObject = null
			answerModel       = null
			quizModel 		  = null

			initialize : (options)->
				{@model,answerWreqrObject, answerModel, @quizModel}=options

				quizModel = @quizModel

				@view = @_getContentBoardView()

				@listenTo @view, "add:new:element", (container, type)->
					App.request "add:new:element", container, type
				
				# @listenTo @view, "show", => 
					
				# 	$('#loading-content-board').remove()

				@listenTo @view, "close", => 
					audioEls = @view.$el.find '.audio'
					_.each audioEls,(el, ind)->
						$(el).find '.pause'
						.trigger 'click'
						
				@listenTo @view, 'dependencies:fetched', =>

					@startFillingElements()
					
					setTimeout =>
						$('#question-area').removeClass 'vHidden'
						$('#loading-content-board').remove()
					, 300
					
						

				#                triggerOnce = _.once _.bind @triggerShowResponse, @, answerData

				App.commands.setHandler "show:response", (marks, total)=>
				   # console.log "#{marks}   #{total}"
					@view.triggerMethod 'show:response', parseFloat(marks).toFixed(1), parseFloat(total).toFixed(1)

				setTimeout =>
					@show @view,
						loading : true
						entities : [@elements]
				, 800



			_getContentBoardView : =>
				new ContentBoard.Views.ContentBoardView
					model : @model
					quizModel: @quizModel
					answerModel: answerModel

			# start filling elements
			startFillingElements : ()=>
				section = @view.model.get 'layout'

				container = $('#myCanvas #question-area')
				
				_.each section, (element, i)=>
					if element.element is 'Row' or element.element is 'TeacherQuestion'
						@addNestedElements container, element
					else
						App.request "add:new:element", container, element.element, element



			addNestedElements : (container, element)=>

				controller = App.request "add:new:element", container, element.element, element
				_.each element.elements, (column, index)=>
					return if not column.elements
					
					container = controller.layout.elementRegion.currentView.$el.children().eq(index)

					_.each column.elements, (ele, i)=>
						if ele.element is 'Row'
							@addNestedElements $(container), ele
						else
							App.request "add:new:element", container, ele.element, ele



			API =
			# add a new element to the builder region
				addNewElement : (container, type, modelData)=>

					decryptedMedia = quizModel.get('videoIDs') if type is 'Video'

					new ContentBoard.Element[type].Controller
						container            : container
						modelData            : modelData
						answerWreqrObject    : answerWreqrObject
						answerModel          : answerModel
						decryptedMedia 		 : decryptedMedia


			App.commands.setHandler 'show:content:board', (options)->
				new ContentBoard.Controller options

			#Request handler for new element
			App.reqres.setHandler "add:new:element", (container, type, modelData = {})=>
				API.addNewElement container, type, modelData

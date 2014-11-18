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
				# videoDecrptedPath= _.initLocalVideosCheck()
				@view = @_getContentBoardView()

				@listenTo @view, "add:new:element", (container, type)->
					App.request "add:new:element", container, type
					
				@listenTo @view, "close", => 
					audioEls = @view.$el.find '.audio'
					_.each audioEls,(el, ind)->
						$(el).find '.pause'
						.trigger 'click'
						
				@listenTo @view, 'dependencies:fetched', =>
					fillElements = @startFillingElements()

					if quizModel.get 'videoIDs'
						allVideoIds = quizModel.get 'videoIDs'
						getDecryptedVideoIdsAndUrl = _.decryptVideos(allVideoIds)
						getDecryptedVideoIdsAndUrl.done (decryptedVideoPathandId)->
							console.log decryptedVideoPathandId


					fillElements.done =>
						setTimeout ->
							$('#loading-content-board').remove()
							$('#question-area').removeClass 'vHidden'
						,500

				#                triggerOnce = _.once _.bind @triggerShowResponse, @, answerData

				App.commands.setHandler "show:response", (marks, total)=>
				   # console.log "#{marks}   #{total}"
					@view.triggerMethod 'show:response', parseFloat(marks).toFixed(1), parseFloat(total).toFixed(1)

				@show @view,
					loading : true
					entities : [@elements]



			_getContentBoardView : =>
				new ContentBoard.Views.ContentBoardView
					model : @model
					quizModel: @quizModel
					answerModel: answerModel

			# start filling elements
			startFillingElements : ()->
				section = @view.model.get 'layout'

				allItemsDeferred =$.Deferred()

				container = $('#myCanvas #question-area')
				_.each section, (element, i)=>
					itemsDeferred= $.Deferred()
					if element.element is 'Row' or element.element is 'TeacherQuestion'
						nestedItems= @addNestedElements container, element
						nestedItems.done =>
							itemsDeferred.resolve()
					else
						App.request "add:new:element", container, element.element, element
						itemsDeferred.resolve()

					itemsDeferred.promise()

					if i is _.size(section)-1
						#itemsDeferred.done =>
						allItemsDeferred.resolve()

				allItemsDeferred.promise()


			addNestedElements : (container, element)->

				defer= $.Deferred()

				controller = App.request "add:new:element", container, element.element, element
				_.each element.elements, (column, index)=>
					nestedDef=$.Deferred()
					if not column.elements
						return nestedDef.resolve()


					container = controller.layout.elementRegion.currentView.$el.children().eq(index)
					_.each column.elements, (ele, i)=>
						if ele.element is 'Row'
							addedElement = @addNestedElements $(container), ele
							addedElement.done =>
								nestedDef.resolve()
						else
							App.request "add:new:element", container, ele.element, ele
							nestedDef.resolve()

					nestedDef.promise()

					if index is _.size(element.elements)-1
						nestedDef.done =>
							defer.resolve()

				defer.promise()

			API =
			# add a new element to the builder region
				addNewElement : (container, type, modelData)=>
					console.log type

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

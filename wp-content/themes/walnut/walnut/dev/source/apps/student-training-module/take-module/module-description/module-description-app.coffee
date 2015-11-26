define ['app'
		'controllers/region-controller'
		'text!apps/take-module-item/module-description/templates/module-description-template.html'
		'bootbox'], (App, RegionController, moduleDescriptionTemplate,bootbox)->
	App.module "StudentTrainingApp.ModuleDescription", (ModuleDescription, App)->
		class ModuleDescriptionController extends RegionController

			initialize: (opts)->
				{@model,@questionResponseModel,@questionResponseCollection,@timerObject,@display_mode} = opts

				@currentItemID = @questionResponseModel.get 'content_piece_id'

				@nextItemID = @_getNextItemID(@currentItemID)

				@view = view = @_showModuleDescriptionView @model

				@show view,
					loading: true
					entities: [@model,@questionResponseModel]

				@listenTo @view, "goto:previous:route", =>
					@region.trigger "goto:previous:route"

				@listenTo @region, "top:panel:question:done", =>
					@view.triggerMethod "top:panel:question:done"

				@listenTo @region, "top:panel:check:last:question", =>
					@view.triggerMethod "top:panel:check:last:question"

				@listenTo view, "question:completed", @_changeQuestion

			_changeQuestion:=>
				@region.trigger "goto:next:question"
				@nextItemID= @_getNextItemID @nextItemID
				@view.triggerMethod "question:changed", @nextItemID

			_getNextItemID :(item_id) =>
				contentLayout = @model.get 'content_layout'
				contentPieces = _.map contentLayout, (m)->
					parseInt m.id

				pieceIndex = _.indexOf(contentPieces, item_id)

				nextItemID = parseInt contentPieces[pieceIndex + 1]

				if not nextItemID
					nextItemID = false

				nextItemID

			_showModuleDescriptionView: (model) =>
				terms = model.get 'term_ids'

				numOfQuestionsCompleted = _.size @questionResponseCollection.where "status": "completed"
				totalNumofQuestions = _.size model.get 'content_pieces'
				timeTakenArray= @questionResponseCollection.pluck('time_taken');
				totalTimeTakenForModule=0
				if _.size(timeTakenArray)>0
					totalTimeTakenForModule =   _.reduce timeTakenArray, (memo, num)-> parseInt memo + parseInt num

				new ModuleDescriptionView
					model           : model
					display_mode    : @display_mode
					nextItemID      : @nextItemID

					templateHelpers:
						showPauseButton:=>
							pauseBtn = '';
							if @display_mode is 'class_mode'
								pauseBtn= '<button type="button" id="pause-session" class="btn btn-white
									action h-center block m-t-5"><i class="fa fa-pause"></i> Pause</button>'
							pauseBtn

						getProgressData:->
							numOfQuestionsCompleted + '/'+ totalNumofQuestions

						getProgressPercentage:->
							parseInt (numOfQuestionsCompleted / totalNumofQuestions)*100

						moduleTime:->
							display_time = $.timeMinSecs totalTimeTakenForModule


		class ModuleDescriptionView extends Marionette.ItemView

			className: 'pieceWrapper'

			template: moduleDescriptionTemplate

			mixinTemplateHelpers :(data)->
				data = super data
				data.isTraining = if @display_mode is 'training' then true else false
				data

			initialize : ->
				@display_mode = Marionette.getOption @, 'display_mode'
				@isLastContentPiece = false


			events:
				'click #back-to-module, #pause-session': ->
					@trigger "goto:previous:route"

				'click #question-done': 'questionCompleted'

			onShow:->

				if not Marionette.getOption(@, 'nextItemID')
					@isLastContentPiece = true
					@$el.find "#question-done"
					.html '<i class="fa fa-forward"></i> Finish Module'

				if @model.get('post_status') is 'archive'
					@$el.find "#question-done"
					.remove()

				stickyHeaderTop = @$el.find("#module-details-region").height()
				$(window).scroll ->
					if $(window).scrollTop() > stickyHeaderTop
						$("#module-details-region").addClass "condensed animated slideInDown"                        
						$("#question-details-region").css "margin-top", stickyHeaderTop+15
					else
						$("#module-details-region").removeClass "condensed slideInDown"
						$("#question-details-region").css "margin-top", 0
					return

				$('#collapseView').on 'hidden.bs.collapse', ->
					$('#accordionToggle').text 'Expand'

				$('#collapseView').on 'shown.bs.collapse', ->
					$('#accordionToggle').text 'Collapse'


			onTopPanelQuestionDone : =>
				@questionCompleted()

			questionCompleted: =>
				if Marionette.getOption(@, 'display_mode') is 'class_mode'
					bootbox.confirm 'This item will be marked as complete. Continue?', (result)=>
						@decidePageFlip() if result

				else @decidePageFlip()

			decidePageFlip : =>
				if @isLastContentPiece
					@trigger "question:completed"
				else 
					@trigger "question:completed"

			onQuestionChanged: (nextItemID)->
				if not nextItemID
					@isLastContentPiece = true
					@$el.find "#question-done"
					.html '<i class="fa fa-forward"></i> Finish Module'

			
						

			onTopPanelCheckLastQuestion : ->
				if @isLastContentPiece
					$ "#top-panel-question-done"
					.html '<i class="fa fa-forward"></i> Finish Module'

		# set handlers
		App.commands.setHandler "show:student:training:module:description", (opt = {})->
			new ModuleDescriptionController opt
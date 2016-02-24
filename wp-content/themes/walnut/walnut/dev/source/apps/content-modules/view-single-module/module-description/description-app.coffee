define ['app'
		'controllers/region-controller'
		'text!apps/content-modules/view-single-module/module-description/templates/module-description.html'], (App, RegionController, collectionDetailsTpl)->
	App.module "CollecionDetailsApp.Controller", (Controller, App)->
		class Controller.ViewCollecionDetailsController extends RegionController

			initialize : (opts)->
				# for take-class module the template changes a bit
				# so based on this value (@mode) we set the template additional stuff
				{@model,@mode,@questionResponseCollection,@textbookNames}= opts
				@view = view = @_getCollectionDetailsView()

				@listenTo view, 'start:teaching:module', =>
					@region.trigger "start:teaching:module"

				@listenTo view, 'goto:previous:route', @_gotoPreviousRoute

				@show view, (loading : true, entities : [@textbookNames])

			_gotoPreviousRoute : ->

				currRoute = App.getCurrentRoute()

				newRoute = _(currRoute).strLeft '/module'

				App.navigate newRoute, true

			_getCollectionDetailsView : ->
				terms = @model.get 'term_ids'

				numOfQuestionsCompleted = _.size @questionResponseCollection.where "status" : "completed"
				totalNumofQuestions = _.size @model.get 'content_pieces'

				new CollectionDetailsView
					model : @model
					mode : @mode
					templateHelpers : @_getTemplateHelpers
						terms : terms
						numOfQuestionsCompleted : numOfQuestionsCompleted
						totalNumofQuestions : totalNumofQuestions


			_getTemplateHelpers : (options)->
				showElapsedTime : =>
					timeTakenArray = @questionResponseCollection.pluck('time_taken');
					totalTimeTakenForModule = 0
					if _.size(timeTakenArray) > 0
						totalTimeTakenForModule = _.reduce timeTakenArray, (memo, num)->
							parseInt memo + parseInt num

					display_time = $.timeMinSecs totalTimeTakenForModule

				getProgressData : ->
					options.numOfQuestionsCompleted + '/' + options.totalNumofQuestions

				getProgressPercentage : ->
					parseInt (options.numOfQuestionsCompleted / options.totalNumofQuestions) * 100

				getTextbookName : =>
					textbook = @textbookNames.get options.terms.textbook
					texbookName = textbook.get 'name' if textbook?

				getChapterName : =>
					chapter = @textbookNames.get options.terms.chapter
					chapterName = chapter.get 'name' if chapter?


				startScheduleButton : =>
					actionButtons = ''

					allContentPieces = @model.get 'content_pieces'
					allContentPieces = _.map allContentPieces, (m)->
						parseInt m
					answeredPieces = @questionResponseCollection.where "status" : "completed"

					if answeredPieces
						answeredIDs = _.chain answeredPieces
						.map (m)->
								m.toJSON()
						.pluck 'content_piece_id'
							.value()


					answeredPieces = @questionResponseCollection.pluck 'content_piece_id'

					unanswered = _.difference allContentPieces, answeredIDs

					if _.size(unanswered) > 0 and @mode isnt 'training' and @model.get('post_status') isnt 'archive'
						actionButtons = '<button type="button" id="start-module" class="btn btn-success action btn-block m-t-10">
																																																			<i class="fa fa-play"></i> Start
																																																		</button>'
					actionButtons


		class CollectionDetailsView extends Marionette.ItemView

			template : collectionDetailsTpl



			events :->
				'click #start-module' : 'startModule'
				'click #go-back-button' : ->
					@trigger "goto:previous:route"

			mixinTemplateHelpers : (data)->
				data = super(data)
				data.takeClassModule = @mode
				data.isTraining = if @mode is 'training' then true else false
				data

			initialize : ->
				@mode = Marionette.getOption @, 'mode'

			startModule : =>
				currentRoute = App.getCurrentRoute()
				#App.navigate currentRoute + "/question"

				@trigger "start:teaching:module"


		# set handlers
		App.commands.setHandler "show:viewgroup:content:group:detailsapp", (opt = {})->
			new Controller.ViewCollecionDetailsController opt


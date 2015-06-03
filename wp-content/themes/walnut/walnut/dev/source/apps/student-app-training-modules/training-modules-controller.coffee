define ['app'
        'controllers/region-controller'
        'apps/student-app-training-modules/training-modules-views'
], (App, RegionController)->
	App.module "StudentsAppTrainingModule.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class
		class View.TrainingModuleController extends RegionController
			initialize: (opts) ->
				{textbookID,@classID,@division,@mode} = opts

				#get the header and left nav back incase it was hidden for quiz view
				$.showHeaderAndLeftNav()

				@textbook = App.request "get:textbook:by:id", textbookID

				@contentGroupsCollection = App.request "get:student:training:modules",
												'textbook': textbookID
												'division': @division

				@chaptersCollection= App.request "get:chapters", ('parent' : textbookID)

				App.execute "when:fetched", [@chaptersCollection,@contentGroupsCollection,@textbook], =>
					chapter_ids= _.chain @contentGroupsCollection.pluck 'term_ids'
					.pluck 'chapter'
						.unique()
						.compact()
						.value()
						
					textbook_ids= _.chain @contentGroupsCollection.pluck 'term_ids'
					.pluck 'textbook'
						.unique()
						.compact()
						.value()
					
					term_ids = _.union textbook_ids, chapter_ids
					
					#all textbook names in this set of contentModulesscollection
					@textbookNames = App.request "get:textbook:names:by:ids", term_ids
					
					App.execute "when:fetched", @textbookNames, =>
						@view = view = @_getContentGroupsListingView @contentGroupsCollection, @textbookNames

						@show @view, loading: true

						@listenTo @view, "schedule:training": (id)=>
							@singleModule = @contentGroupsCollection.get id
							modalview = @_showScheduleModal @singleModule
							@show modalview, region: App.popupRegion

							@listenTo modalview, "save:scheduled:date", @_saveSchedule

						@listenTo @view, "fetch:chapters:or:sections", (parentID, filterType) =>
							chaptersOrSections= App.request "get:chapters", ('parent' : parentID)
							App.execute "when:fetched", chaptersOrSections, =>
								@view.triggerMethod "fetch:chapters:or:sections:completed", chaptersOrSections,filterType


			_saveSchedule: (id, date)=>

				singleModule = @contentGroupsCollection.get id

				first_content_piece = _.first singleModule.get 'content_pieces'

				data=
					collection_id   : id
					content_piece_id: first_content_piece
					start_date      : date
					division        : @division
					status          : 'scheduled'

				App.request "schedule:content:group",data

				@view.triggerMethod 'scheduled:module', id,date

			_getContentGroupsListingView: (collection, textbookNames)=>
				new View.TakeClassTextbookModules.ContentGroupsView
					collection          : collection
					mode                : @mode
					chaptersCollection  : @chaptersCollection
					fullCollection      : collection.clone()
					textbookNames 		: textbookNames

					templateHelpers:
						showModulesHeading:=>

							headingString='<span class="semi-bold">All</span> Modules'

							if @mode is 'training'
								headingString='<span class="semi-bold">Practice</span> Modules'

							headingString

			_showScheduleModal: (model)=>
				new ScheduleModalView
					model: model

		class ScheduleModalView extends Marionette.ItemView

			template: '<div class="modal fade" id="schedule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
											<div class="modal-dialog">
											  <div class="modal-content">
												<div class="modal-header">
												  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
												  <h4 class="modal-title" id="myModalLabel">Schedule Module</h4>
												</div>
												<div class="modal-body">
												  <div data-date-format="yyyy-mm-dd" class="input-append success date">
																  <input id="scheduled-date" type="text" value="{{training_date}}" placeholder="Select Date" class="span12">
																  <span class="add-on"><span class="arrow"></span><i class="fa fa-calendar"></i></span>
														  </div>
														  <button type="button" class="btn btn-success" data-dismiss="modal">Save</button>
												</div>
											  </div>
											</div>
										</div>'

			events:
				'click .btn-success': 'saveScheduledDate'

			onShow: ->
				nowDate = new Date();
				today= new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

				$('.input-append.date').datepicker
					autoclose: true
					todayHighlight: true
					startDate: today


			serializeData: ->
				data = super()

				training_date = @model.get 'training_date'

				if training_date isnt ''
					data.training_date = moment(training_date).format("YYYY-MM-DD")

				data

			saveScheduledDate: (e)=>
				dataID = @model.get 'id'
				scheduledDate = @$el.find '#scheduled-date'
				.val()

				if scheduledDate isnt ''
					@trigger "save:scheduled:date", dataID, scheduledDate



		# set handlers
		App.commands.setHandler "show:student:app:training:modules", (opt = {})->
			new View.TrainingModuleController opt
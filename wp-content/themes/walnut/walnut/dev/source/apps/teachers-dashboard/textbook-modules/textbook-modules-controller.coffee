define ['app'
		'controllers/region-controller'
		'apps/teachers-dashboard/textbook-modules/textbook-modules-views'
		], (App, RegionController)->

	App.module "TeachersDashboardApp.View", (View, App)->

		#List of textbooks available to a teacher for training or to take a class

		class View.textbookModulesController extends RegionController
			initialize : (opts) ->

				{textbookID} = opts
				{@classID} 	 = opts
				{@division} 	 = opts

				@textbook= App.request "get:textbook:by:id", textbookID

				@contentGroupsCollection = App.request "get:content:groups", ('textbook' :textbookID, 'division': @division)

				@view = view = @_getContentGroupsListingView @contentGroupsCollection

				App.execute "when:fetched", @textbook, =>

					textbookName= @textbook.get 'name'

					breadcrumb_items = 'items':[
							{'label':'Dashboard','link':'#teachers/dashboard'},
							{'label':'Take Class','link':'#teachers/take-class/'+@classID+'/'+@division},
							{'label':textbookName,'link':'javascript:;','active':'active'}
						]
						
					App.execute "update:breadcrumb:model", breadcrumb_items

					@show @view, (loading:true)

				@listenTo @view, "save:training:status" : (id,status)=>
					@_saveTrainingStatus id,status

				@listenTo @view, "schedule:training" : (id)=>
					@singleModule = @contentGroupsCollection.get id
					modalview = @_showScheduleModal @singleModule
					@show modalview, region: App.dialogRegion

					@listenTo modalview, "save:scheduled:date":(id,date)=>
						date = moment(date.toString()).format("YYYY-MM-DD")
						@singleModule.set ('training_date': date)
						@_saveTrainingStatus id, 'scheduled'


			_saveTrainingStatus: (id,status)=>

				singleModule = @contentGroupsCollection.get id

				singleModule.set ('status': status)

				opts =
					'changed' 	: 'status'
					'division'	: @division

				singleModule.save(opts, {wait : true})

				@view.triggerMethod 'status:change', singleModule

			_getContentGroupsListingView : (collection)=>
				new View.TextbookModules.ContentGroupsView
					collection: collection
					templateHelpers:
						showTextbookName :=>
							@textbook.get 'name'

			_showScheduleModal : (model)=>
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
								  <button type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
						</div>
					  </div>
					</div>
				</div>'

			events: 
				'click .btn-primary' : 'saveScheduledDate'

			onShow:->
				$('.input-append.date').datepicker
					autoclose: true
					todayHighlight: true

				
			serializeData:->

				data = super()

				training_date = @model.get 'training_date'

				if training_date isnt ''
					data.training_date = moment(training_date).format("YYYY-MM-DD")

				data

			saveScheduledDate:(e)=>

				dataID = @model.get 'id'
				scheduledDate = @$el.find '#scheduled-date'
								.val()

				if scheduledDate isnt ''
					@trigger "save:scheduled:date", dataID, scheduledDate


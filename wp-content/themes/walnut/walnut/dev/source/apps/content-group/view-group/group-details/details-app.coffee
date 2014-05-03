define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/group-details/templates/group-details.html'], (App, RegionController, collectionDetailsTpl)->

	App.module "CollecionDetailsApp.Controller", (Controller, App)->

		class Controller.ViewCollecionDetailsController extends RegionController

			initialize :(opts)->

				# for take-class module the template changes a bit
				# so based on this value (@module_name) we set the template additional stuff

				{@model,@module_name,@questionResponseCollection}= opts

				@startTime = '';
				@endTime = '';

				@view= view = @_getCollectionDetailsView @model

				@show view, (loading:true)

				@listenTo view, 'start:teaching:module', => @region.trigger "start:teaching:module"

				@listenTo @model, 'training:module:started', @trainingModuleStarted

				@listenTo @model, 'training:module:stopped', @trainingModuleStopped
				
			_getCollectionDetailsView : (model)->

				terms= model.get 'term_ids'
				textbook= terms.textbook
				@textbookName = App.request "get:textbook:name:by:id", textbook

				new CollectionDetailsView
					model 	: model 								
					module_name 	: @module_name

					templateHelpers:

						getTextbookName:=>
							@textbookName 

						startScheduleButton:=>
							
							actionButtons= ''

							allContentPieces= @model.get 'content_pieces'
							answeredPieces = @questionResponseCollection.pluck 'content_piece_id'
							unanswered = _.difference allContentPieces, answeredPieces

							if _.size(unanswered) >0 
								actionButtons= '<button type="button" id="start-module" class="btn btn-white btn-small action pull-right m-t-10">
									<i class="fa fa-play"></i> Start
								</button>
								<button type="button" class="btn btn-white btn-small pull-right m-t-10 m-r-10" data-toggle="modal" data-target="#schedule">
									<i class="fa fa-calendar"></i> Schedule
								</button>'
							actionButtons

			trainingModuleStarted:=>		
				@startTime = moment().format();
				@view.triggerMethod "display:time"


			trainingModuleStopped:=>		
				@endTime = moment().format();
				@view.triggerMethod "stop:training:module"

		class CollectionDetailsView extends Marionette.ItemView

			template 	: collectionDetailsTpl

			className 	: 'tiles white grid simple vertical green'

			events: 
				'click #start-module' : 'startModule'
				'click #stop-module' : 'stopModule'


			onShow:->
				if _.size($('#timekeeper'))>0
					@onDisplayTime()

			serializeData:->
				data = super()
				data.takeClassModule= Marionette.getOption @, 'module_name'
				data

			startModule:=>

				currentRoute = App.getCurrentRoute()
				App.navigate currentRoute+"/question"

				@model.trigger "start:module"
				@trigger "start:teaching:module"

			stopModule:=>
				$('#timekeeper').timer('pause');

				@$el.find '#stop-module'
				.attr 'id','start-module'
				.html '<i class="fa fa-play"></i> Resume '

				@model.trigger "stop:module"

			onDisplayTime:->

				@$el.find '#start-module'
				.attr 'id','stop-module'
				.html '<i class="fa fa-pause"></i> Pause '

				if not _.size($('#timekeeper'))>0
					$("#header-left").after "<div id='timekeeper' style='display:none'></div>"
					$('#timekeeper').timer('start');
				else 
					$('#timekeeper').timer('resume');

				clock = setInterval @updateTime, 500

			updateTime :=>
				@$el.find '.timedisplay'
				.html 'Elapsed Time: '+ $('#timekeeper').html()


		# set handlers
		App.commands.setHandler "show:viewgroup:content:group:detailsapp", (opt = {})->
			new Controller.ViewCollecionDetailsController opt		


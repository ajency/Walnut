define ['app'
		'controllers/region-controller'
		'text!apps/content-group/view-group/group-details/templates/group-details.html'], (App, RegionController, collectionDetailsTpl)->

	App.module "CollecionDetailsApp.Controller", (Controller, App)->

		class Controller.ViewCollecionDetailsController extends RegionController

			initialize :(opts)->

				{@model}= opts

				@startTime = '';
				@endTime = '';

				# for take-class module the template changes a bit
				# so based on this value (@module) we set the template additional stuff

				{@module} = opts 

				@view= view = @_getCollectionDetailsView @model

				@show view, (loading:true)

				@listenTo @model, 'training:module:started', @trainingModuleStarted

				@listenTo @model, 'training:module:stopped', @trainingModuleStopped
				
			_getCollectionDetailsView : (model)->

				terms= model.get 'term_ids'
				textbook= terms.textbook
				@textbookName = App.request "get:textbook:name:by:id", textbook

				new CollectionDetailsView
					model 	: model 								
					module 	: @module

					templateHelpers:
						getTextbookName:=>
							@textbookName 
					
						


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
				data.takeClassModule= Marionette.getOption @, 'module'
				data

			startModule:=>
				@model.trigger "start:module"

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


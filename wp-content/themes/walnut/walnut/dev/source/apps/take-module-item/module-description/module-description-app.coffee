define ['app'
		'controllers/region-controller'
		'text!apps/take-module-item/module-description/templates/module-description-template.html']
		, (App, RegionController, moduleDescriptionTemplate)->
	
	App.module "TeacherTeachingApp.ModuleDescription", (ModuleDescription, App)->
		
		class ModuleDescriptionController extends RegionController

			initialize: (opts)->
				{model,@questionResponseModel,@questionResponseCollection,@timerObject,@display_mode} = opts

				@view = view = @_showModuleDescriptionView model

				@show view, (loading: true)

				@listenTo @view, "goto:previous:route", =>
					@region.trigger "goto:previous:route"


			_showModuleDescriptionView: (model) =>
				terms = model.get 'term_ids'

				numOfQuestionsCompleted = _.size @questionResponseCollection.where "status": "completed"
				totalNumofQuestions = _.size model.get 'content_pieces'
				timeTakenArray= @questionResponseCollection.pluck('time_taken');
				totalTimeTakenForModule=0
				if _.size(timeTakenArray)>0
					totalTimeTakenForModule =   _.reduce timeTakenArray, (memo, num)-> parseInt memo + parseInt num

				new ModuleDescriptionView
					model: model
					mode : @display_mode

					templateHelpers:
						showPauseButton:=>
							pauseBtn = ''
							if @display_mode is 'class_mode'
								pauseBtn= '<button type="button" id="pause-session" class="btn btn-white
									action pull-right m-t-5 m-l-20"><i class="fa fa-pause"></i> Pause</button>'
							pauseBtn

						getProgressData:->
							numOfQuestionsCompleted + '/'+ totalNumofQuestions

						getProgressPercentage:->
							parseInt (numOfQuestionsCompleted / totalNumofQuestions)*100

						moduleTime:->
							hours=0
							time= totalTimeTakenForModule
							mins=parseInt(time/60)
							if mins >59
								hours = parseInt mins/60
								mins= parseInt mins%60
							seconds = parseInt time%60
							display_time = ''

							if hours > 0
								display_time= hours+'h '

							display_time += mins + 'm '+ seconds+'s'


		class ModuleDescriptionView extends Marionette.ItemView

			className: 'pieceWrapper'

			template: moduleDescriptionTemplate

			mixinTemplateHelpers :(data)->
				data = super data
				data.isTraining = if @mode is 'training' then true else false
				data

			initialize : ->
				@mode = Marionette.getOption @, 'mode'


			events:
				'click #back-to-module, #pause-session': ->

					_.deleteAllDecryptedVideoFilesFromVideosWebDirectory() if _.platform() is 'DEVICE'

					@trigger "goto:previous:route"


			onShow : ->

				if _.platform() is 'DEVICE'

					#Cordova pause event
					document.addEventListener("pause"
						,=>
							console.log 'Fired cordova pause event'

							_.deleteAllDecryptedVideoFilesFromVideosWebDirectory()
							
							@trigger "goto:previous:route"
						
						, false)

					onBackbuttonClick = =>
						console.log 'Fired cordova back button event'

						_.deleteAllDecryptedVideoFilesFromVideosWebDirectory()

						Backbone.history.history.back()

						document.removeEventListener("backbutton", onBackbuttonClick, false)

					#Cordova backbutton event
					document.addEventListener("backbutton", onBackbuttonClick, false) 


		# set handlers
		App.commands.setHandler "show:teacher:teaching:module:description", (opt = {})->
			new ModuleDescriptionController opt
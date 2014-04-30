define ['app'
		'controllers/region-controller'
		'text!apps/teachers-dashboard/single-question/chorus-options/templates/chorus-options-template.html'], (App, RegionController,chorusOptionsTemplate)->

	App.module "SingleQuestionChorusOptionsApp", (ChorusOptions, App)->

		class ChorusOptionsController extends RegionController

			initialize : (opts)->
				{@questionResponseModel} = opts

				@view= view = @_showQuestionView @questionResponseModel

				@show view, (loading:true)

				@listenTo view, "save:question:response", @_saveQuestionResponse

				@listenTo view, "question:completed", @_changeQuestion

			_changeQuestion:->

				App.SingleQuestionChorusOptionsApp.trigger "goto:next:question"			

			_showQuestionView : (model)->
				new ChorusOptionsView 
					model 				: model
					responsePercentage 	: @questionResponseModel.get 'question_response'

			_saveQuestionResponse:(studResponse)=>
				@questionResponseModel.set 
					'question_response'	: studResponse

				@questionResponseModel.save(null,{wait : true, success: @successFn, error: @errorFn})


		class ChorusOptionsView extends Marionette.ItemView

			className: 'studentList m-t-35'

			template : chorusOptionsTemplate

			events:
				'click .tiles.single'	: 'selectStudent'
				'click #question-done' 	: (e)-> @trigger "question:completed"

			onShow:->
				responsePercentage = Marionette.getOption @, 'responsePercentage'
				@$el.find '#'+responsePercentage
				.find '.default'
				.addClass 'green'

			selectStudent:(e)->
				@$el.find '.green'
				.removeClass 'green'

				dataValue= $(e.target).closest '.tiles.single' 
							.attr 'id'

				$(e.target).closest('.tiles.single')
				.find '.default'
				.addClass 'green'
				.find 'i'
				.removeClass 'fa-minus-circle'
				.addClass 'fa-check-circle'

				@trigger "save:question:response", dataValue


		# set handlers
		App.commands.setHandler "show:single:question:chorus:options:app", (opt = {})->
			new ChorusOptionsController opt	
				
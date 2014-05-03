define ['app'
		'controllers/region-controller'
		'apps/teachers-dashboard/teacher-teaching-module/student-list/student-list-views'], (App, RegionController)->

	App.module "SingleQuestionStudentsListApp", (Students, App)->

		class SingleQuestionStudentsController extends RegionController

			initialize : (opts)->
				{@questionResponseModel,studentCollection, @display_mode} = opts

				division = @questionResponseModel.get 'division'

				@view= view = @_showStudentsListView studentCollection


				@show view, (loading:true, entities:[studentCollection])


				@listenTo view, "save:question:response", @_saveQuestionResponse

				@listenTo view, "question:completed", @_changeQuestion

			_changeQuestion:(resp)=>
				
				@_saveQuestionResponse '' if resp is 'no_answer'

				@region.trigger "goto:next:question", @questionResponseModel.get 'content_piece_id'	


			_showStudentsListView :(collection) =>
				new Students.Views.StudentsList 
					collection 			: collection
					correctAnswers 		: @questionResponseModel.get 'question_response'
					display_mode 		: @display_mode

			_saveQuestionResponse:(studResponse)=>
				@questionResponseModel.set 
					'question_response'	: studResponse

				@questionResponseModel.save(null,{wait : true, success: @successFn, error: @errorFn})

			successFn :(model)=>
				console.log model

			errorFn :->
				console.log 'error'
								

		# set handlers
		App.commands.setHandler "show:single:question:student:list:app", (opt = {})->
			new SingleQuestionStudentsController opt		


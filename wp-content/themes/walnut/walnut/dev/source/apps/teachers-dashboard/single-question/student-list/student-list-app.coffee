define ['app'
		'controllers/region-controller'
		'apps/teachers-dashboard/single-question/student-list/student-list-views'], (App, RegionController)->

	App.module "SingleQuestionStudentsListApp", (Students, App)->

		class SingleQuestionStudentsController extends RegionController

			initialize : (opts)->
				{@questionResponseModel} = opts

				division = @questionResponseModel.get 'division'

				studentsCollection= App.request "get:user:collection", ('role':'student', 'division': division)

				@view= view = @_showStudentsListView studentsCollection

				

				@listenTo view, "save:question:response", @_saveQuestionResponse

				@listenTo view, "question:completed", @_changeQuestion

				@show view, (loading:true, entities:[studentsCollection])

			_changeQuestion:->
				App.SingleQuestionStudentsListApp.trigger "goto:next:question"

			_showStudentsListView :(collection) =>
				new Students.Views.StudentsList 
					collection 			: collection
					correctAnswers 		: @questionResponseModel.get 'question_response'

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


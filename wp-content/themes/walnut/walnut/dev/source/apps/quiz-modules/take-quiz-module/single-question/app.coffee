define ['app'
		'controllers/region-controller'
		'bootbox'
		'apps/quiz-modules/take-quiz-module/single-question/views'],
		(App, RegionController,bootbox)->

			App.module "TakeQuizApp.SingleQuestion", (SingleQuestion, App)->

				answer=null
				answerData= null

				class SingleQuestion.Controller extends RegionController

					initialize: (opts)->
						{@model, @quizModel, @questionResponseCollection,@display_mode,@direction} = opts

						@questionResponseModel= @questionResponseCollection.findWhere 'content_piece_id' : @model.id

						displayAnswer = @quizModel.hasPermission 'display_answer'

						@answerWreqrObject = new Backbone.Wreqr.RequestResponse()
						@answerWreqrObject.displayAnswer= displayAnswer
						@answerWreqrObject.multiplicationFactor = @model.get 'multiplicationFactor'

						@layout = layout = @_showSingleQuestionLayout @model, @direction

						@answerModel = App.request "create:new:answer"

						if @questionResponseModel and @questionResponseModel.get('status') isnt 'paused'    

							# if the question is not having permission of single attempt, 
							# ie. can be skipped and answered again,
							# display answer should be false.
							# if not class mode then the answer can be displayed if display answer permission is there
							if @display_mode is 'class_mode' and not @quizModel.hasPermission 'single_attempt'
								@answerWreqrObject.displayAnswer = false

							answerData = @questionResponseModel.get 'question_response'

							answerData = {} if _.isEmpty answerData

							answerData.status = @questionResponseModel.get 'status'
							answerData.marks = @questionResponseModel.get 'marks_scored'                            
							@answerModel = App.request "create:new:answer", answerData


						@show layout,
							loading: true

						@listenTo layout, "show", @_showContentBoard @model,@answerWreqrObject,@direction

						@listenTo @region, "silent:save:question", =>
							answerData= @answerWreqrObject.request "get:question:answer"

							answer = answerData.answerModel

							@answerWreqrObject.request "submit:answer"
							answer_status = @_getAnswerStatus answer.get('marks'), answerData.totalMarks

							answer.set 'status' : answer_status

							if (answer.get('status') is 'wrong_answer') and _.toBool @quizModel.get 'negMarksEnable'
								answer.set 'marks': - answerData.totalMarks*@quizModel.get('negMarks')/100

							@region.trigger "submit:question", answer

						@listenTo layout, "validate:answer",->
							answerData= @answerWreqrObject.request "get:question:answer"

							answer = answerData.answerModel

							if answerData.questionType isnt 'sort'

								if answerData.emptyOrIncomplete is 'empty'

									bootbox.confirm @quizModel.getMessageContent('submit_without_attempting'),(result)=>
										@_triggerSubmit() if result

								else
									@_triggerSubmit()

							else 
								@_triggerSubmit()

						@listenTo layout, "goto:next:question",->
							@region.trigger "goto:next:question"

						@listenTo layout, "goto:previous:question",
							-> @region.trigger "goto:previous:question"

						@listenTo layout, "skip:question",-> 

							@answerModel.set 'status': 'skipped'

							@region.trigger "skip:question", @answerModel

						@listenTo layout, 'show:hint:dialog',=>
							@answerModel.set 'hint_viewed' : true

						@listenTo @region, 'trigger:submit',=> @_triggerSubmit()

					_triggerSubmit:->
						@layout.triggerMethod "submit:question"

						if _.contains _.pluck(this.model.get('layout'),'element'),'BigAnswer'
							answer.set 'status' : 'teacher_check'

						else
							@answerWreqrObject.request "submit:answer"

							answer.set 'status' : @_getAnswerStatus answer.get('marks'), answerData.totalMarks

							if answer.get('status') is 'wrong_answer' and _.toBool @quizModel.get 'negMarksEnable'
								answer.set 'marks': - answerData.totalMarks*@quizModel.get('negMarks')/100

						@region.trigger "submit:question", answer

					_getAnswerStatus:(recievedMarks, totalMarks)->
						status = 'wrong_answer'

						recievedMarks = parseFloat recievedMarks
						totalMarks = parseFloat totalMarks

						if recievedMarks is totalMarks 
							status = 'correct_answer' 

						if recievedMarks > 0 and recievedMarks < totalMarks
							status = 'partially_correct' 

						status

					_showContentBoard:(model,answerWreqrObject,direction='ltr')=>
						App.execute "show:content:board",
								region              : @layout.contentBoardRegion,
								model               : model
								answerWreqrObject   : answerWreqrObject
								answerModel         : @answerModel
								quizModel           : @quizModel
								direction			: direction

					_showSingleQuestionLayout: (model) =>
						new SingleQuestion.SingleQuestionLayout
							model: model
							questionResponseModel   : @questionResponseModel
							quizModel               : @quizModel
							display_mode            : @display_mode
define ['app'
		'controllers/region-controller'
		'apps/quiz-modules/take-quiz-module/quiz-description/app'
		'apps/quiz-modules/take-quiz-module/quiz-progress/app'
		'apps/quiz-modules/take-quiz-module/quiz-timer/app'
		'apps/quiz-modules/take-quiz-module/single-question/app'], (App, RegionController)->

		App.module "TakeQuizApp", (View, App)->

			#Single Question description and answers
			quizModel = null
			quizResponseSummary = null
			questionsCollection = null
			questionResponseModel = null
			questionModel = null
			questionIDs = null
			timeBeforeCurrentQuestion = null
			pausedQuestionTime = 0 # incase a question was paused previously. this time needs to be added to the current question
			studentTrainingModule =null

			class View.TakeQuizController extends RegionController

				initialize : (opts)->
					console.log opts
					abc = opts.quizModel
					if abc.get('status') == 'completed' && abc.get('quiz_type') == 'class_test'
						result = abc.get 'permissions'
						result.display_answer = true
					{quizModel,quizResponseSummary,questionsCollection,
					@questionResponseCollection,@textbookNames,@display_mode, studentTrainingModule} = opts

					@_startTakeQuiz()

					App.vent.bind "closed:quiz", @_autosaveQuestionTime

				_startTakeQuiz:=>

					if not @questionResponseCollection
						@questionResponseCollection= App.request "create:empty:question:response:collection"
						timeBeforeCurrentQuestion = 0

					App.leftNavRegion.reset()
					App.headerRegion.reset()

					questionIDs = questionsCollection.pluck 'ID'
					questionIDs= _.map questionIDs, (m)-> parseInt m

					pausedQuestion= @questionResponseCollection.findWhere 'status': 'paused'

					if pausedQuestion 
						questionID = pausedQuestion.get 'content_piece_id'
						pausedQuestionTime = parseInt pausedQuestion.get 'time_taken'     

					else
						unanswered = @_getUnansweredIDs()

						if not _.isEmpty unanswered
							questionID =_.first @_getUnansweredIDs()

						else
							questionID = _.first(questionIDs) if not questionID

					if quizResponseSummary.isNew() 
						data = 
							'status' : 'started'
							'questions_order': questionIDs

						quizModel.set 'attempts' : parseInt(quizModel.get('attempts'))+1

						quizResponseSummary.save data

					questionModel = questionsCollection.get questionID
					@layout = layout = new TakeQuizLayout

					@show @layout,
						loading : true

					@timerObject = new Backbone.Wreqr.RequestResponse()

					@listenTo @layout, "show", @_showQuizViews

					@listenTo @layout.questionDisplayRegion, "goto:next:question", @_gotoNextQuestion

					@listenTo @layout.questionDisplayRegion, "submit:question", @_submitQuestion

					@listenTo @layout.questionDisplayRegion, "goto:previous:question", @_gotoPreviousQuestion

					@listenTo @layout.questionDisplayRegion, "skip:question", @_skipQuestion

					@listenTo @layout.quizTimerRegion, "end:quiz", @_endQuiz
					@listenTo @layout.quizTimerRegion, "show:single:quiz:app", @_showSingleQuizApp

					@listenTo @layout.quizProgressRegion, "change:question", @_changeQuestion

					setInterval =>
						time = @timerObject.request "get:elapsed:time"
						@_autosaveQuestionTime() if time and quizResponseSummary.get('status') isnt 'completed'                            
					,30000
					
					$(window).on 'beforeunload', =>
						@_autosaveQuestionTime()
						return 'Quiz in progress'
						
				_autosaveQuestionTime:=>

					questionResponseModel = @questionResponseCollection.findWhere 'content_piece_id': questionModel.id

					totalTime =@timerObject.request "get:elapsed:time"
					timeTaken= totalTime + pausedQuestionTime - timeBeforeCurrentQuestion

					if (not questionResponseModel) or questionResponseModel.get('status') in ['not_started','paused']

						console.log(questionResponseModel.get('status')) if questionResponseModel

						data =
							'summary_id'     : quizResponseSummary.id
							'content_piece_id'  : questionModel.id
							'question_response' : []
							'status'            : 'paused'
							'marks_scored'      : 0
							'time_taken'        : timeTaken

						questionResponseModel = App.request "create:quiz:question:response:model", data

					else
						questionResponseModel.set 'time_taken' : timeTaken

					@_saveQuizResponseModel questionResponseModel

				_changeQuestion:(changeToQuestion)=>
					#save results here of previous question / skip the question
					questionModel = questionsCollection.get changeToQuestion
					@_showSingleQuestionApp()


				_submitQuestion:(answer)->
					#save results here

					if(answer.get('status') == 'wrong_answer' && answer.get('answer').length == 0)
						single_status = 'skipped'
					else
						single_status = answer.get 'status'

					totalTime =@timerObject.request "get:elapsed:time"
					timeTaken= totalTime + pausedQuestionTime - timeBeforeCurrentQuestion
					pausedQuestionTime =0 #reset to 0 once used
					timeBeforeCurrentQuestion= totalTime

					data =
						'summary_id'     : quizResponseSummary.id
						'content_piece_id'  : questionModel.id
						'question_response' : _.omit answer.toJSON(), ['marks','status']
						'status'            : single_status
						'marks_scored'      : answer.get 'marks'
						'time_taken'        : timeTaken

					newResponseModel = App.request "create:quiz:question:response:model", data

					@_saveQuizResponseModel newResponseModel

				_saveQuizResponseModel:(newResponseModel)=>

					quizResponseModel = @questionResponseCollection.findWhere 'content_piece_id' : newResponseModel.get 'content_piece_id'

					#update existing model (incase of resubmit)
					if quizResponseModel
						quizResponseModel.set newResponseModel.toJSON()

					#add new model to collection
					else
						quizResponseModel = newResponseModel
						@questionResponseCollection.add newResponseModel

					quizResponseModel.save()

					if quizResponseModel.get('status') isnt 'paused'
						@layout.quizProgressRegion.trigger "question:submitted", quizResponseModel

				_skipQuestion:(answer)->
					#save skipped status
					@_submitQuestion answer
					@_gotoNextQuestion()

				_gotoNextQuestion:->

					nextQuestionID = @_getNextItemID() if questionModel?

					if nextQuestionID
						questionModel= questionsCollection.get nextQuestionID
						@_showSingleQuestionApp()

					else
						@_showSingleQuizApp()

				_endQuiz:->
					console.log @display_mode

					questionResponseModel = this.questionResponseCollection.findWhere 'content_piece_id' : questionModel.id

					if @display_mode not in ['replay', 'quiz_report']
						console.log questionResponseModel

						if (not questionResponseModel) or questionResponseModel.get('status') in ['paused','not_attempted']
							@layout.questionDisplayRegion.trigger "silent:save:question"

						unanswered = @_getUnansweredIDs()

						if unanswered
							_.each unanswered, (question,index)=>
								questionModel = questionsCollection.get question
								answerModel = App.request "create:new:answer"
								answerModel.set 'status': 'skipped'

								@_submitQuestion answerModel

						quizResponseSummary.set 
							'status'            : 'completed' 
							'total_time_taken'  : timeBeforeCurrentQuestion

							'num_skipped'       : _.size @questionResponseCollection.where 'status': 'skipped'

							'marks_scored'      : @questionResponseCollection.getMarksScored()

							'negative_scored'   : @questionResponseCollection.getNegativeScored()

							'total_marks_scored': @questionResponseCollection.getTotalScored()

						quizResponseSummary.save()

						@_queueStudentMail()


				_showSingleQuizApp:->
					
					App.execute "show:single:quiz:app",
						region                      : App.mainContentRegion
						quizModel                   : quizModel
						questionsCollection         : questionsCollection
						questionResponseCollection  : @questionResponseCollection
						quizResponseSummary         : quizResponseSummary
						display_mode                : @display_mode
						studentTrainingModule:studentTrainingModule

				_queueStudentMail:->
					data=
						component           : 'quiz'
						communication_type  : 'quiz_completed_student_mail'
						communication_mode  : 'email'
						additional_data:
							quiz_id         : quizModel.id

					App.request "save:communications", data

				_getUnansweredIDs:->

					pausedModel = @questionResponseCollection.findWhere 'status': 'paused'

					answeredIDs= @questionResponseCollection.pluck 'content_piece_id'

					if pausedModel
						answeredIDs = _.without answeredIDs, pausedModel.get 'content_piece_id'

					allIDs= _.map quizModel.get('content_pieces'), (m)-> parseInt m

					unanswered= _.difference allIDs, answeredIDs

				_gotoPreviousQuestion:->

					prevQuestionID = @_getPrevItemID() if questionModel?

					if prevQuestionID
						questionModel= questionsCollection.get prevQuestionID
						@_showSingleQuestionApp direction: 'rtl'

				_getNextItemID : ->
					pieceIndex = _.indexOf(questionIDs, questionModel.id)
					nextIndex = pieceIndex + 1

					if nextIndex < questionIDs.length
						nextID = parseInt questionIDs[nextIndex]

					else 
						unanswered = @_getUnansweredIDs()
						nextID= _.first _.intersection questionIDs,unanswered if unanswered


					nextID

				_getPrevItemID : ->
					pieceIndex = _.indexOf(questionIDs, questionModel.id)
					prevID = parseInt questionIDs[pieceIndex - 1] if pieceIndex>0


				_showSingleQuestionApp:(direction='ltr')->

					display_mode = if @display_mode is 'quiz_report' then 'replay' else @display_mode

					if questionModel
						new View.SingleQuestion.Controller
							region                  : @layout.questionDisplayRegion
							model                   : questionModel
							quizModel               : quizModel
							questionResponseCollection   : @questionResponseCollection
							display_mode            : display_mode
							direction				: direction

						@layout.quizProgressRegion.trigger "question:changed", questionModel
						@layout.quizDescriptionRegion.trigger "question:changed", questionModel

				_showQuizViews:->
					new View.QuizDescription.Controller
						region          : @layout.quizDescriptionRegion
						model           : quizModel
						currentQuestion : questionModel
						textbookNames   : @textbookNames
						display_mode    : @display_mode


					new View.QuizProgress.Controller
						region: @layout.quizProgressRegion
						questionsCollection         : questionsCollection
						currentQuestion             : questionModel
						quizModel                   : quizModel
						questionResponseCollection  : @questionResponseCollection

					new View.QuizTimer.Controller
						region      : @layout.quizTimerRegion
						model       : quizModel
						display_mode: @display_mode
						timerObject : @timerObject
						quizResponseSummary         : quizResponseSummary

					@_showSingleQuestionApp()

			class TakeQuizLayout extends Marionette.Layout

				template : '<div id="quiz-description-region"></div>
											<div class="sidebarContainer">
												<div id="quiz-timer-region"></div>
												<div id="quiz-progress-region"></div>
											</div>
											<div id="question-display-region"></div>'

				regions :
					quizDescriptionRegion : '#quiz-description-region'
					quizTimerRegion : '#quiz-timer-region'
					quizProgressRegion : '#quiz-progress-region'
					questionDisplayRegion : '#question-display-region'

				className: 'content'

				onShow : ->
					$('.page-content').addClass 'condensed expand-page'

			# set handlers
			App.commands.setHandler "start:take:quiz:app", (opt = {})->
				new View.TakeQuizController opt




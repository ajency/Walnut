define ['app'
		'backbone'], (App, Backbone) ->

		App.module "Entities.QuizQuestionResponse", (QuizQuestionResponse, App, Backbone, Marionette, $, _)->

			#response entity of each of the individual question in a quiz
			class QuizQuestionResponse.ResponseModel extends Backbone.Model 

				idAttribute: 'qr_id' 	#CP [content_piece_id]   Q [quizID]   S [studentID]  [eg. CP233Q34S12]

				defaults:
					summary_id 			: ''
					content_piece_id    : 0
					question_response   : []
					time_taken          : 0
					marks_scored 		: 0
					status              : ''

				name: 'quiz-question-response'

			class QuizQuestionResponse.ResponseCollection extends Backbone.Collection
				model: QuizQuestionResponse.ResponseModel
				url: ->
					AJAXURL + '?action=get-all-quiz-question-responses'

				parse: (resp)->
					@total = resp.count
					resp.data

				getTotalScored:->
					total = _.reduce @.pluck('marks_scored'), (memo, num)->
								_.toNumber memo + num,1
								
				getMarksScored:->
					
					scored =0

					marks=@.pluck('marks_scored')
					
					_.each marks, (m)-> scored += m if m>0

					scored.toFixed 1

				getNegativeScored:->
					
					negative =0

					marks=@.pluck('marks_scored')

					_.each marks, (m)-> negative += m if m<0

					negative.toFixed 1


			API = 

				createQuizQuestionResponseModel : (data = {})->

						quizResponseModel = new QuizQuestionResponse.ResponseModel
						
						quizResponseModel.set data

						quizResponseModel

				createEmptyQuizQuestionResponseCollection : (data = {})->

						responseCollection = new QuizQuestionResponse.ResponseCollection
						
						responseCollection

				getAllQuizQuestionResponses: (param = {})->
					responseCollection = new QuizQuestionResponse.ResponseCollection
					responseCollection.fetch
						reset: true
						data: param

					responseCollection

			App.reqres.setHandler "create:quiz:question:response:model",(data)->
					API.createQuizQuestionResponseModel data


			App.reqres.setHandler "create:empty:question:response:collection",(data)->
					API.createEmptyQuizQuestionResponseCollection data
			
			App.reqres.setHandler "get:quiz:question:response:collection", (params) ->
					API.getAllQuizQuestionResponses params


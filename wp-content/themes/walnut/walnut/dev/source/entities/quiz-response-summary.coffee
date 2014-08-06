define ['app'
		'backbone'], (App, Backbone) ->

		App.module "Entities.QuizQuestionResponse", (QuizResponse, App, Backbone, Marionette, $, _)->

			#quiz response summary of individual quiz
			class QuizResponseSummary.SummaryModel extends Backbone.Model 

				idAttribute: 'summary_id'  #Q [quizID]   S [studentID]         [eg. Q34S12]

				defaults:
	            	collection_id       : 0
	            	user_id             : 0
	            	total_time_taken    : 0
	            	marks_scored 		: 0
	            	status              : '' # started | completed

	            name: 'quiz-response-summary'

	        class QuizResponseSummary.SummaryCollection extends Backbone.Collection
	            model: QuizResponseSummary.SummaryModel
	            url: ->
	                AJAXURL + '?action=get-all-quiz-response-summary'

	            parse: (resp)->
	                @total = resp.count
	                resp.data


			API = 

				createQuizResponseSummary : (data = {})->

						quizResponseSummary = new QuizResponseSummary.SummaryModel
						
						quizResponseSummary.set data

						quizResponseSummary

			App.reqres.setHandler "create:quiz:response:summary",(data)->
					API.createQuizResponseSummaryModel data

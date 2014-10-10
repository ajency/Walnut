define ['app'
		'backbone'], (App, Backbone) ->

		App.module "Entities.QuizQuestionResponse", (QuizResponseSummary, App, Backbone, Marionette, $, _)->

			#quiz response summary of individual quiz
			class QuizResponseSummary.SummaryModel extends Backbone.Model 

				idAttribute: 'summary_id'  #Q [quizID]   S [studentID]         [eg. Q34S12]

				defaults:
					collection_id       		: 0
					student_id          		: 0
					taken_on 					: ''
					num_skipped 				: 0
					total_time_taken    		: 0
					total_marks_scored 			: 0
					status              		: '' # started | completed

				name: 'quiz-response-summary'

			class QuizResponseSummary.SummaryCollection extends Backbone.Collection
				model: QuizResponseSummary.SummaryModel
				url: ->
					AJAXURL + '?action=get-quiz-response-summary'

				parse: (resp)->
					resp.data


			API = 

				createQuizResponseSummary : (data = {})->

					if not data.collection_id and data.student_id
						return false

					quizResponseSummary = new QuizResponseSummary.SummaryModel
					
					quizResponseSummary.set data

					quizResponseSummary


				getQuizResponseSummary:(param={})->

					QuizResponseSummaryCollection = new QuizResponseSummary.SummaryCollection

					QuizResponseSummaryCollection.fetch
						reset: true
						data: param

					QuizResponseSummaryCollection


				getQuizResponseSummaryByID:(summary_id)->

					quizResponseSummary = new QuizResponseSummary.SummaryModel summary_id: summary_id
					
					quizResponseSummary.fetch()

					quizResponseSummary

				createQuizResponseSummaryCollection:(data)->

					QuizResponseSummaryCollection = new QuizResponseSummary.SummaryCollection

					QuizResponseSummaryCollection.set data

					QuizResponseSummaryCollection



			App.reqres.setHandler "create:quiz:response:summary",(data)->
					API.createQuizResponseSummary data

			App.reqres.setHandler "get:quiz:response:summary:by:id",(summary_id)->
					API.getQuizResponseSummaryByID summary_id

			App.reqres.setHandler "get:quiz:response:summary",(data)->
					API.getQuizResponseSummary data

			App.reqres.setHandler "create:quiz:response:summary:collection",(data)->
					API.createQuizResponseSummaryCollection data



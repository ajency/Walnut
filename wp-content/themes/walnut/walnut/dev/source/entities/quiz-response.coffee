define ['app'
		'backbone'], (App, Backbone) ->

		App.module "Entities.QuizResponse", (QuizResponse, App, Backbone, Marionette, $, _)->

			class QuizResponse.QuizResponseModel extends Backbone.Model 

				idAttribute: 'ref_id'

				defaults:
	            	collection_id       : 0
	            	content_piece_id    : 0
	            	user_id             : 0
	            	question_response   : []
	            	time_taken          : 0
	            	start_date          : ''
	            	end_date            : ''
	            	status              : ''

	            name: 'quiz-response'

	        class QuizResponse.QuizResponseCollection extends Backbone.Collection
	            model: QuizResponse.QuizResponseModel
	            url: ->
	                AJAXURL + '?action=get-quiz-response'

	            parse: (resp)->
	                @total = resp.count
	                resp.data


			API = 

				createQuizResponseModel : (data = {})->

						quizResponseModel = new QuizResponse.QuizResponseModel
						
						quizResponseModel.set data

						quizResponseModel

				getAllQuizResponses: (param = {})->
    	            responseCollection = new QuizResponse.QuizResponseCollection
    	            responseCollection.fetch
	                    reset: true
	                    data: param

	                responseCollection

			App.reqres.setHandler "create:quiz:response:model",(data)->
					API.createQuizResponseModel data
			
			App.reqres.setHandler "get:quiz:response:collection", (params) ->
					API.getAllQuizResponses params


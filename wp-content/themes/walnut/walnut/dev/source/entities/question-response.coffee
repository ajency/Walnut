define ["app", 'backbone'], (App, Backbone) ->

		App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->
			

			# textbook model
			class QuestionResponseModel extends Backbone.Model

				defaults:
					content_piece_id  	 	: 0
					collection_id			: 0
					date_created     	  	: ''
					date_modified      	   	: ''
					total_time	 			: 0
					question_response		: []
					time_started			: 0
					time_completed			: 0

				name: 'question-response'


			# textbooks collection class
			class QuestionResponseCollection extends Backbone.Collection
				model : QuestionResponseModel
				comparator : 'term_order'
				url :->
					 AJAXURL + '?action=get-question-response'
				
				parse:(resp)->
					@total = resp.count	
					resp.data

			responseCollection = new QuestionResponseCollection

			# API 
			API = 
				# get all textbooks
				getQuestionResponse:(param = {})->
					responseCollection.fetch
										reset : true
										data  : param

					responseCollection

				saveQuestionResponse:(param = {})->


			# request handler to get all textbooks
			App.reqres.setHandler "get:question:response", (opt) ->
				API.getQuestionResponse(opt)

			App.reqres.setHandler "save:question:response", (id)->
				API.saveQuestionResponse id


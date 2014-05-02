define ["app", 'backbone', 'unserialize'], (App, Backbone) ->

		App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->
			

			# textbook model
			class QuestionResponseModel extends Backbone.Model

				defaults:
					collection_id 			: 0
					content_piece_id  	 	: 0
					date_created     	  	: ''
					date_modified      	   	: ''
					total_time	 			: 0
					question_response		: []
					time_started			: ''
					time_completed			: ''

				name: 'question-response'


			# textbooks collection class
			class QuestionResponseCollection extends Backbone.Collection
				model : QuestionResponseModel
				comparator : 'term_order'
				name: 'question-response'
				
				url :->
					 AJAXURL + '?action=get-question-response'
				
				parse:(resp)->
					@total = resp.count
					resp.data

			

			# API 
			API = 
				# get response collection
				getAllQuestionResponses:(param = {})->
					responseCollection = new QuestionResponseCollection
					responseCollection.fetch
										reset : true
										data  : param

					responseCollection


				saveQuestionResponse:(data)->
					questionResponse = new QuestionResponseModel data
					questionResponse


				# get question response from local database
				getQuestionResponseFromLocal:(collection_id, division)->
					question_type = 'individual' #Hard coded for now
					runQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_35_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), onFailure(d));
					
					onSuccess =(d)->
						(tx,data)->
							result = []
							i = 0
							while i < data.rows.length
								row = data.rows.item(i)
								q_resp = ''
								q_resp = unserialize(row['question_response']) if question_type is 'individual'

								result[i] = 
									id: row['id']
									content_piece_id: row['content_piece_id']
									collection_id: row['collection_id']
									division: row['division']
									date_created: row['date_created']
									date_modified: row['date_modified']
									total_time: row['total_time']
									question_response: q_resp
									time_started: row['time_started']
									time_completed: row['time_completed']

								i++	
		
							d.resolve(result)

					onFailure =(d)->
						(tx,error)->
							d.reject 'ERROR: '+error

					$.when(runQuery()).done (data)->
						console.log 'getQuestionResponseFromLocal transaction completed'
					.fail (error)->
						console.log 'ERROR: '+error	


			# request handler to get all responses
			App.reqres.setHandler "get:question:response:collection", (params) ->
				API.getAllQuestionResponses params 

			App.reqres.setHandler "save:question:response", (qID)->
				API.saveQuestionResponse qID

			# request handler to get all responses from local database
			App.reqres.setHandler "get:question-response:local", (collection_id, division)->
				API.getQuestionResponseFromLocal collection_id, division	


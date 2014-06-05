define ["app", 'backbone', 'unserialize', 'serialize'], (App, Backbone) ->
	App.module "Entities.QuestionResponse", (QuestionResponse, App, Backbone, Marionette, $, _)->


		# textbook model
		class QuestionResponseModel extends Backbone.Model

			idAttribute: 'ref_id'

			defaults:
				collection_id       : 0
				content_piece_id    : 0
				division            : 0
				question_response   : []
				time_taken          : 0
				start_date          : ''
				end_date            : ''
				status              : ''

			name: 'question-response'


		# textbooks collection class
		class QuestionResponseCollection extends Backbone.Collection
			model: QuestionResponseModel
			comparator: 'term_order'
			name: 'question-response'

			url: ->
				AJAXURL + '?action=get-question-response'

			parse: (resp)->
				@total = resp.count
				resp.data


		# API
		API =
		# get response collection
			getAllQuestionResponses: (param = {})->
				responseCollection = new QuestionResponseCollection
				responseCollection.fetch
					reset: true
					data: param

				responseCollection


			saveQuestionResponse: (data)->
				questionResponse = new QuestionResponseModel data

				questionResponse


			# get question response from local database
			getQuestionResponseFromLocal:(collection_id, division)->

				runMainQuery = ->
					$.Deferred (d)->
						_.db.transaction (tx)->
							tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response 
								WHERE collection_id=? AND division=?", [collection_id, division]
								, onSuccess(d), _.deferredErrorHandler(d));
					
				onSuccess =(d)->
					(tx,data)->
						result = []

						for i in [0..data.rows.length-1] by 1
							
							r = data.rows.item(i)

							do(r, i)->
								questionType = _.getMetaValue(r['content_piece_id'])
								questionType.done (meta_value)->
									if meta_value.question_type is 'individual'
										q_resp = unserialize(r['question_response'])
									else q_resp = r['question_response'] 

									result[i] = 
										ref_id: r['ref_id']
										content_piece_id: r['content_piece_id']
										collection_id: r['collection_id']
										division: r['division']
										question_response: q_resp
										time_taken: r['time_taken']
										start_date: r['start_date']
										end_date: r['end_date']
										status: r['status']
		
						d.resolve(result)           

				$.when(runMainQuery()).done (data)->
					console.log 'getQuestionResponseFromLocal transaction completed'
				.fail _.failureHandler
				
			
			# save/update question_response to local database    
			saveUpdateQuestionResponseLocal:(model)->

				_.saveUpdateQuestionResponse model



		# request handler to get all responses
		App.reqres.setHandler "get:question:response:collection", (params) ->
			API.getAllQuestionResponses params

		App.reqres.setHandler "save:question:response", (qID)->
			API.saveQuestionResponse qID
	   

		# request handler to get all responses from local database
		App.reqres.setHandler "get:question-response:local", (collection_id, division)->
			API.getQuestionResponseFromLocal collection_id, division

		App.reqres.setHandler "save:question-response:local", (model)->
			API.saveUpdateQuestionResponseLocal model    


define ["app", 'backbone', 'unserialize', 'serialize'], (App, Backbone) ->

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
					#get question_type from wp_postmeta
					getQuestionType =(content_piece_id)->
						runQ =->
							$.Deferred (d)->
								_.db.transaction (tx)->
									tx.executeSql("SELECT meta_value FROM wp_postmeta WHERE post_id=? AND meta_key='question_type'", [content_piece_id], success(d), deferredErrorHandler(d))

						success =(d)->
							(tx,data)->
								meta_value = data.rows.item(0)['meta_value']
								d.resolve(meta_value)

						$.when(runQ()).done ->
							console.log 'getQuestionType transaction completed'
						.fail(failureHandler)


					runMainQuery = ->
						$.Deferred (d)->
							_.db.transaction (tx)->
								tx.executeSql("SELECT * FROM wp_question_response WHERE collection_id=? AND division=?", [collection_id, division], onSuccess(d), deferredErrorHandler(d));
					
					onSuccess =(d)->
						(tx,data)->
							result = []
							i = 0
							while i < data.rows.length
								r = data.rows.item(i)

								do(r, i)->
									questionType = getQuestionType(r['content_piece_id'])
									questionType.done (question_type)->
										if question_type is 'individual'
											q_resp = unserialize(r['question_response'])
										else q_resp = r['question_response']	

										result[i] = 
											id: r['id']
											content_piece_id: r['content_piece_id']
											collection_id: r['collection_id']
											division: r['division']
											date_created: r['date_created']
											date_modified: r['date_modified']
											total_time: r['total_time']
											question_response: q_resp
											time_started: r['time_started']
											time_completed: r['time_completed']

								i++	
		
							d.resolve(result)

					#Error handlers
					deferredErrorHandler =(d)->
						(tx, error)->
							d.reject(error)

					failureHandler = (error)->
						console.log 'ERROR: '+error.message			

					$.when(runMainQuery()).done (data)->
						console.log 'getQuestionResponseFromLocal transaction completed'
					.fail(failureHandler)
				
				
				saveQuestionResponseLocal:(p)->
					#function to insert record in wp_question_response
					insertQuestionResponse =(data)->
						_.db.transaction( (tx)->
							tx.executeSql("INSERT INTO wp_question_response (content_piece_id, collection_id, division, date_created, date_modified, total_time, question_response, time_started, time_completed) 
								VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.content_piece_id, data.collection_id, data.division, data.date_created, data.date_modified, data.total_time, data.question_response, data.time_started, data.time_completed])
							
						,(tx, error)->
							console.log 'ERROR: '+error.message
						,(tx)->
							console.log 'Success: Inserted new record in wp_question_response'
						)


					#function to update record in wp_question_response
					updateQuestionResponse =(data)->
						_.db.transaction( (tx)->
							tx.executeSql("UPDATE wp_question_response SET date_modified=?, question_response=? 
								WHERE id=?", [data.date_modified, data.question_response, data.id])
							
						,(tx, error)->
							console.log 'ERROR: '+error.message
						,(tx)->
							console.log 'Success: Updated record in wp_question_response'
						)

					if typeof p.id is 'undefined'
						insertData =
							collection_id: p.collection_id
							content_piece_id: p.content_piece_id
							division: p.division
							date_created: _.getCurrentDate()
							date_modified: _.getCurrentDate()
							total_time: 0
							question_response: serialize(p.question_response)
							time_started: ''
							time_completed: ''
						
						insertQuestionResponse(insertData)	

					else 
						updateData =
							id: p.id
							date_modified: _.getCurrentDate()
							question_response: serialize(p.question_response)

						updateQuestionResponse(updateData)


			# request handler to get all responses
			App.reqres.setHandler "get:question:response:collection", (params) ->
				API.getAllQuestionResponses params 

			App.reqres.setHandler "save:question:response", (qID)->
				API.saveQuestionResponse qID

			# request handler to get all responses from local database
			App.reqres.setHandler "get:question-response:local", (collection_id, division)->
				API.getQuestionResponseFromLocal collection_id, division

			App.reqres.setHandler "save:question-response:local", (params)->
				API.saveQuestionResponseLocal params		


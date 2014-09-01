define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-group entity

	_.mixin

		getQuizByTextbookIdAndUserID : (textbookId, userID, division)->

			runQuery = ->

				pattern = '%"'+textbookId+'"%'

				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids 
							LIKE '"+pattern+"' AND post_status IN ('publish', 'archive') AND 
							type=?", ['quiz'], onSuccess(d), _.deferredErrorHandler(d))

				
			onSuccess = (d)->
				(tx, data)->

					result = []

					for i in [0..data.rows.length-1] by 1

						row = data.rows.item(i)
						console.log "row"
						console.log row
						console.log JSON.stringify row

						do (row, i)->
							contentPiecesAndDescription = _.getContentPiecesAndDescription(row['id'])
							contentPiecesAndDescription.done (data)->

								contentPieces = description = ''
								contentPieces = unserialize(data.content_pieces) if data.content_pieces isnt ''
								description = unserialize(data.description) if data.description isnt ''

								do (row, i, contentPieces, description)->
									dateAndStatus = _.getDateAndStatus(row['id'], division, contentPieces)
									dateAndStatus.done (data)->
										status = data.status
										date = data.start_date

										if not (row['status'] is 'archive' and status is 'not started')
											
											data = 
												id: row['id']
												name: row['name']
												created_on: row['created_on']
												created_by: row['created_by']
												last_modified_on: row['last_modified_on']
												last_modified_by: row['last_modified_by']
												published_on: row['published_on']
												published_by: row['published_by']
												type: row['type']
												term_ids: unserialize(row['term_ids'])
												duration: _.getDuration(row['duration'])
												minshours: _.getMinsHours(row['duration'])
												total_minutes: row['duration']
												status: status
												training_date: date
												content_pieces: contentPieces
												description: description
												post_status: row['status']

											result.push data
					
					d.resolve result		

			$.when(runQuery()).done (data)->
				console.log 'getContentGroupByTextbookIdAndDivision transaction completed'
			.fail _.failureHandler


		
		getContentGroupById : (id)->

			runQuery = ->

				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_content_collection WHERE id=?", [id]
							, onSuccess(d), _.deferredErrorHandler(d))

				
			onSuccess = (d)->
				(tx, data)->

					row = data.rows.item(0)

					do (row)->
						contentPiecesAndDescription = _.getContentPiecesAndDescription(row['id'])
						contentPiecesAndDescription.done (data)->
							
							contentPieces = description = ''
							contentPieces = unserialize(data.content_pieces) if data.content_pieces isnt ''
							description = unserialize(data.description) if data.description isnt ''

							result = 
								id: row['id']
								name: row['name']
								created_on: row['created_on']
								created_by: row['created_by']
								last_modified_on: row['last_modified_on']
								last_modified_by: row['last_modified_by']
								published_on: row['published_on']
								published_by: row['published_by']
								type: row['type']
								term_ids: unserialize(row['term_ids'])
								duration: _.getDuration(row['duration'])
								minshours: _.getMinsHours(row['duration'])
								total_minutes: row['duration']
								status: row['status']
								content_pieces: contentPieces
								description: description
					
							d.resolve result		

			$.when(runQuery()).done (data)->
				console.log 'getContentGroupById transaction completed'
			.fail _.failureHandler



		
		getDateAndStatus : (collection_id, division, content_pieces)->

			runFunc = ->

				$.Deferred (d)->

					data = start_date:'', status:''

					module_responses = _.getModuleResponses(collection_id, division)
					module_responses.done (module_responses)->

						if _.isEmpty module_responses
							data.status = 'not started'

						if not _.isEmpty module_responses
							if _.first(module_responses).status is 'scheduled' 
								data.status = 'scheduled'
							else data.status = 'started'

							data.start_date = _.last(module_responses).start_date

							response_content_ids = []

							_.each module_responses, (response, key)->
								if response.status is 'completed'
									response_content_ids[key] = response.content_piece_id

							if (content_pieces.length - response_content_ids.length) is 0
								data.status = 'completed'

						d.resolve data

			
			$.when(runFunc()).done ->
				console.log 'getDateAndStatus done'
			.fail _.failureHandler



		#Get content_piece_id, status, start_date from table 'wp_question_response'
		getModuleResponses : (collection_id, division)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT content_piece_id, status, start_date 
							FROM "+_.getTblPrefix()+"question_response WHERE collection_id=? 
							AND division=?", [collection_id, division]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx, data)->
					result = []

					for i in [0..data.rows.length-1] by 1

						result[i] = data.rows.item(i)

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getModuleResponses transaction completed'
			.fail _.failureHandler

		

		getContentPiecesAndDescription : (collection_id)->

			contentPiecesAndDescription = content_pieces: '', description: ''

			runQuery =->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?"
							,[collection_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						if row['meta_key'] is 'description'
							contentPiecesAndDescription.description = row['meta_value']

						if row['meta_key'] is 'content_pieces'
							contentPiecesAndDescription.content_pieces = row['meta_value']
					
					d.resolve(contentPiecesAndDescription)

			$.when(runQuery()).done ->
				console.log 'getContentPiecesAndDescription transaction completed'
			.fail _.failureHandler

		
		
		getDuration : (duration)->

			if duration > 60
				duration/60
			else
				duration

		
		getMinsHours : (duration)->

			if duration > 60
				'hrs'
			else 'mins'	
define ['underscore', 'unserialize'], ( _) ->

	#Functions related to content-group entity

	_.mixin

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
				console.log 'getDataFromQuestionResponse transaction completed'
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

		
		
		getDuration : (duration)->

			if duration > 60
				duration/60
			else
				duration

		
		getMinsHours : (duration)->

			if duration > 60
				'hrs'
			else 'mins'				
									


							


				


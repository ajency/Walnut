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

		
		
		#Get last details i.e id, status and date from wp_training_logs
		getLastDetails : (collection_id, division)->

			lastDetails = id: '', date: '', status: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT id, status, date FROM "+_.getTblPrefix()+"training_logs 
							WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1"
							, [collection_id, division], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx, data)->
					if data.rows.length isnt 0
						row = data.rows.item(0)

						lastDetails = id : row['id'], date : row['date'], status : row['status']

					d.resolve(lastDetails)

			$.when(runQuery()).done ->
				console.log 'getLastDetails transaction completed'
			.fail _.failureHandler


		
		getDataFromQuestionResponse : (collection_id, division)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT content_piece_id, status 
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

			runGetDateAndStatus = ->
				$.Deferred (d)->

					data = date:'', status:''

					dateAndStatus = _.getLastDetails(collection_id, division)
					dateAndStatus.done (lastDetails)->
						
						if lastDetails.id isnt ''
							data['date'] = lastDetails.date
							data['status'] = 'scheduled'

						quesResponse = _.getDataFromQuestionResponse(collection_id, division)
						quesResponse.done (quesRes)->
							
							if quesRes.length isnt 0
								data['status'] = 'started'

							response_content_ids = []

							_.each quesRes, (response, key)->
								if response.status is 'completed'
									response_content_ids[key] = response.content_piece_id

							if (content_pieces.length - response_content_ids.length) is 0
								data['status'] = 'completed'

							d.resolve(data)

			
			$.when(runGetDateAndStatus()).done ->
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
									


							


				



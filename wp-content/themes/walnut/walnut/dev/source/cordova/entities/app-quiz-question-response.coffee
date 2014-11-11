define ['underscore', 'unserialize', 'serialize'], ( _) ->


	_.mixin

		getQuizQuestionResponseBySummaryID : (summary_id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				result = []

				if data.rows.length is 0
					
					defer.resolve result
				
				else

					forEach = (row, i)->
						
						_.getTotalMarksScoredAndTotalTimeTaken(summary_id)
						.then (value)->
							console.log value

							result[i] = 
								content_piece_id : row['content_piece_id']
								marks_scored: value.total_marks_scored
								qr_id: row['qr_id']
								question_response : _.unserialize(row['question_response'])
								status : row['status']
								summary_id :summary_id
								time_taken : value.total_time_taken
						
						

							i = i + 1

							if ( i < data.rows.length)
								forEach data.rows.item(i), i

							else
								console.log "getQuizQuestionResponseBySummaryID done"
								defer.resolve result

					forEach data.rows.item(0), 0

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM "+_.getTblPrefix()+"quiz_question_response 
								WHERE summary_id = ?"
								, [summary_id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()




		getTotalMarksScoredAndTotalTimeTaken : (summary_id)->
			
			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				result = ''
				
				result = data.rows.item(0)
				
				console.log "getTotalMarksScoredAndTotalTimeTaken done"
				defer.resolve result

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT SUM(marks_scored) as total_marks_scored, 
								SUM(CASE WHEN status = 'wrong_answer' 
								THEN marks_scored ELSE 0 END) as negative_scored, 
								SUM(CASE WHEN status <> 'wrong_answer' 
								THEN marks_scored ELSE 0 END) as marks_scored, 
								SUM(time_taken) as total_time_taken 
								FROM "+_.getTblPrefix()+"quiz_question_response 
								WHERE summary_id = ? "
								, [summary_id] 
				, onSuccess, _.transactionErrorHandler


			defer.promise()



		#insert/update data in quiz question response
		writeQuestionResponse : (model)->

			_.getQuizResponseSummary(model.get('summary_id'))
			.then (collection_id)->

				_.getCollectionMeta(collection_id)
				.then (collectionMetaData)->

					check_permissions = collectionMetaData.permission
					

					if model.get('qr_id') is "" or typeof model.get('qr_id') is 'undefined'
						qr_id = 'CP'+model.get('content_piece_id')+model.get('summary_id')
						_.insertIntoQuizQuestionResponse(model, qr_id)

					else
						_.getOldQuizQuestionResponseData(model,check_permissions)


		#Get collection_id based on summary id from quiz_response_summary
		#Based on the collection_id get the permisions
		getQuizResponseSummary : (summary_id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				result = data.rows.item(0)['collection_id']
				defer.resolve result

			_.db.transaction (tx)->
				
				tx.executeSql "SELECT * FROM "+_.getTblPrefix()+"quiz_response_summary 
								WHERE summary_id = ?"
								, [summary_id] 
				, onSuccess, _.transactionErrorHandler

			defer.promise()



		#Insert in the table quiz_question_response if there is no qr_id
		insertIntoQuizQuestionResponse :(model, qr_id)->

			question_response = serialize(model.get('question_response'))

			_.db.transaction((tx)->

				tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_question_response (qr_id
					, summary_id, content_piece_id, question_response
					, time_taken, marks_scored, status, sync) 
					VALUES (?,?,?,?,?,?,?,?)"
					, [qr_id, model.get('summary_id'), model.get('content_piece_id')
					, question_response, model.get('time_taken')
					, model.get('marks_scored'), model.get('status'), 0])

			,_.transactionErrorHandler

			,(tx)->
				console.log 'Inserted data in quiz question response'
				model.set 'qr_id' :qr_id
				# _.selectData(1)
			)

		selectData : (v)->

			_.db.transaction (tx)->
				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_question_response ", []
					, (tx,results)->
						result= new Array()
						# if results.length>0
						for i in [0..results.rows.length-1] by 1
							result[i] = results.rows.item(i)
						
						# alert "final"
						console.log JSON.stringify result

					, _.transactionErrorHandler)


		#Update table quiz_question_response id qr_id if present
		getOldQuizQuestionResponseData :(model,check_permissions)->

			_.db.transaction (tx)->
				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_question_response 
					WHERE qr_id = ?", [model.get('qr_id')]
					, (tx,results)->
						# if results.length>0
						qrId = model.get('qr_id')
						result = results.rows.item(0)
						console.log JSON.stringify result

						if result.status is "paused" and model.get('status') is "paused"
							_.updatePausedQuizQuestionResponseData(model)

						else 
							if result.status isnt "paused"
								# alert "not paused"
								if check_permissions.single_attempt is true
									# model.set 'qr_id' : qrId
									# model.set 'error' : 'Permissions denied'
									console.log "Permissions denied"

								else if check_permissions.allow_resubmit isnt true and result.status isnt "skipped"
									# model.set 'qr_id' : qrId
									# model.set 'error' : 'Permissions denied'
									console.log "Permissions denied"

								else
									_.updateQuizQuestionResponseData(model)

							else
								_.updateQuizQuestionResponseData(model)

					, _.transactionErrorHandler)
			# onSuccess =(d)->

			# 	(tx,data)->

			# 		result = data.rows.item(0)
			# 		if result.status is "paused" or model.get('status') is "paused"
			# 			_.updatePausedQuizQuestionResponseData(model)

			# 		else if result.status isnt "paused"

			# 			if check_permissions.single_attempt is "true"
			# 				_.updateQuizQuestionResponseData(model)

			# 			if check_permissions.allow_resubmit isnt "true" and result.status isnt "skipped"
			# 				_.updateQuizQuestionResponseData(model)



		#update the table when the question is paused
		updatePausedQuizQuestionResponseData: (model)->

			qrId = model.get('qr_id')
			_.db.transaction((tx)->

				tx.executeSql("UPDATE "+_.getTblPrefix()+"quiz_question_response SET 
					status= ?, time_taken= ?, sync= ? 
					WHERE summary_id= ?"
					, ['paused', model.get('time_taken'), 0, model.get('summary_id')])

			,_.transactionErrorHandler

			,(tx)->
				# _.selectData(2)
				model.set 'qr_id' : qrId
				console.log 'Updated data in quiz_question_response (updatePausedQuizQuestionResponseData)'
			)



		updateQuizQuestionResponseData: (model)->
			qrId = model.get('qr_id')
			question_response = serialize(model.get('question_response'))
			_.db.transaction((tx)->

				tx.executeSql "UPDATE "+_.getTblPrefix()+"quiz_question_response 
								SET summary_id=?, content_piece_id=?
								, question_response=?, time_taken=?
								, marks_scored=?, status=?, sync=? 
								WHERE qr_id=?"
								, [ model.get('summary_id'), model.get('content_piece_id')
								, question_response, model.get('time_taken')
								, model.get('marks_scored'), model.get('status'), 0
								, model.get('qr_id')]

			,_.transactionErrorHandler

			,(tx)->
				# _.selectData(3)
				model.set 'qr_id' : qrId
				console.log 'Updated data in quiz_question_response (updateQuizQuestionResponseData)'
			)



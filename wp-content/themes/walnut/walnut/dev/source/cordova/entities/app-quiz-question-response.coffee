define ['underscore', 'unserialize', 'serialize'], ( _) ->


	_.mixin

		getQuizQuestionResponseBySummaryID : (summary_id)->

			runQuery = ->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE summary_id = ?", [summary_id] 
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->

				(tx,data)->

					result = []
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						do (row, i)->
							totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(summary_id)
							totalMarksScoredAndTotalTimeTaken.done (value)->

								result[i] = 
									content_piece_id : row['content_piece_id']
									marks_scored: value.total_marks_scored
									qr_id: row['qr_id']
									question_response : _.unserialize(row['question_response'])
									status : row['status']
									summary_id :summary_id
									time_taken : value.total_time_taken

					# if result.length>0
					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuizQuestionResponseBySummaryID transaction completed'
			.fail _.failureHandler




		getTotalMarksScoredAndTotalTimeTaken : (summary_id)->

			runQuery = ->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT SUM(marks_scored) as total_marks_scored, 
							SUM(CASE WHEN status = 'wrong_answer' 
							THEN marks_scored ELSE 0 END) as negative_scored, 
							SUM(CASE WHEN status <> 'wrong_answer' 
							THEN marks_scored ELSE 0 END) as marks_scored, 
							SUM(time_taken) as total_time_taken 
							FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE summary_id = ? ", 
							[summary_id] 
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->

				(tx,data)->
					result = ''
					result = data.rows.item(0)

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getTotalMarksScoredAndTotalTimeTaken transaction completed'
			.fail _.failureHandler




		#insert/update data in quiz question response
		writeQuestionResponse : (model)->

			quizResponseSummary = _.getQuizResponseSummary(model.get('summary_id'))
			quizResponseSummary.done (collection_id)->

				collectionMeta = _.getCollectionMeta(collection_id)
				collectionMeta.done (collectionMetaData)->

					check_permissions = collectionMetaData.permission
					

					if model.get('qr_id') is "" or typeof model.get('qr_id') is 'undefined'
						qr_id = 'CP'+model.get('content_piece_id')+model.get('summary_id')
						_.insertIntoQuizQuestionResponse(model, qr_id)

					else
						_.getOldQuizQuestionResponseData(model,check_permissions)


		#Get collection_id based on summary id from quiz_response_summary
		#Based on the collection_id get the permisions
		getQuizResponseSummary : (summary_id)->

			runQuery = ->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_response_summary 
							WHERE summary_id = ?", [summary_id] 
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->

				(tx,data)->

					result = data.rows.item(0)['collection_id']
					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuizResponseSummary transaction completed'
			.fail _.failureHandler



		#Insert in the table quiz_question_response if there is no qr_id
		insertIntoQuizQuestionResponse :(model, qr_id)->
			# alert "insert"
			console.log model.get('status')

			question_response = serialize(model.get('question_response'))

			_.db.transaction((tx)->

				tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_question_response (qr_id
					, summary_id, content_piece_id, question_response
					, time_taken, marks_scored, status, sync) 
					VALUES (?,?,?,?,?,?,?,?)"
					, [qr_id, model.get('summary_id'), model.get('content_piece_id')
					, question_response, model.get('time_taken')
					, model.get('marks_scored'), model.get('status'), 0])

			,_.transactionErrorhandler

			,(tx)->
				console.log 'Inserted data in quiz question response'
				model.set 'qr_id' :qr_id
				_.selectData(1)
			)

		selectData : (v)->
			# alert v
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
						console.log result.status
						console.log model.get('status')

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
						# model.set 'qr_id' : qrId
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
			# alert "update"
			console.log model

			qrId = model.get('qr_id')
			_.db.transaction((tx)->

				tx.executeSql("UPDATE "+_.getTblPrefix()+"quiz_question_response SET 
					status= ?, time_taken= ?, sync= ? 
					WHERE summary_id= ?"
					, ['paused', model.get('time_taken'), 0, model.get('summary_id')])

			,_.transactionErrorhandler

			,(tx)->
				_.selectData(2)
				model.set 'qr_id' : qrId
				console.log 'Updated data in quiz_question_response (updatePausedQuizQuestionResponseData)'
			)



		updateQuizQuestionResponseData: (model)->
			console.log model      
			qrId = model.get('qr_id')
			question_response = serialize(model.get('question_response'))
			_.db.transaction((tx)->

				tx.executeSql("UPDATE "+_.getTblPrefix()+"quiz_question_response SET summary_id=?, 
					content_piece_id=?, question_response=?
					, time_taken=?, marks_scored=?, status=?, sync=? 
					WHERE qr_id=?"
					, [ model.get('summary_id'), model.get('content_piece_id'), 
					question_response, model.get('time_taken'), 
					model.get('marks_scored'), model.get('status'), 0
					, model.get('qr_id')])

			,_.transactionErrorhandler

			,(tx)->
				_.selectData(3)
				model.set 'qr_id' : qrId
				console.log 'Updated data in quiz_question_response (updateQuizQuestionResponseData)'
			)



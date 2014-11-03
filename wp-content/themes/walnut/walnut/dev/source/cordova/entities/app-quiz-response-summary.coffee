define ['underscore', 'unserialize', 'serialize'], ( _) ->


	_.mixin

		getQuizResponseSummaryByCollectionIdAndUserID : (collection_id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->

				result = []

				if data.rows.length is 0
					defer.resolve result
				
				else
					
					forEach = (row, i)->
						_.getQuizResponseSummaryByCollectionId(collection_id)
						.then (quiz_responses)->
							
							_.getCountForSkippedQuestion(row['summary_id'])
							.then (skipped)->

										
								_.getTotalMarksScoredAndTotalTimeTaken(row['summary_id'])
								.then (value)->
									userID = _.getUserID()
									quiz_meta = _.unserialize(row['quiz_meta'])

									result[i] = 
										collection_id : collection_id
										marks_scored: value.marks_scored
										attempts:quiz_responses.attempts
										negative_scored: value.negative_scored
										num_skipped: skipped
										questions_order:quiz_meta.questions_order
										status : quiz_meta.status
										student_id : userID
										summary_id : row['summary_id']
										taken_on : row['taken_on']
										total_marks_scored : value.total_marks_scored
										total_time_taken : value.total_time_taken



									i = i + 1

									if ( i < data.rows.length)
										forEach data.rows.item(i), i

									else
										console.log "getQuizResponseSummaryByCollectionIdAndUserID done"
										defer.resolve result


					forEach data.rows.item(0), 0



			_.db.transaction (tx)->
				
				tx.executeSql "SELECT taken_on, quiz_meta, summary_id 
								FROM "+_.getTblPrefix()+"quiz_response_summary 
								WHERE collection_id=? 
								AND student_id=?"
								, [collection_id, _.getUserID()] 
				, onSuccess, _.transactionErrorHandler



			defer.promise()




		getCountForSkippedQuestion : (summary_id)->

			defer = $.Deferred()

			onSuccess = (tx,data)->
				
				result = data.rows.item(0)['num_skipped']
				console.log "getCountForSkippedQuestion done"
				defer.resolve result
					
			_.db.transaction (tx)->
				tx.executeSql "SELECT COUNT(status) AS num_skipped 
					FROM "+_.getTblPrefix()+"quiz_question_response 
					WHERE status = ? AND summary_id = ?"
					, ['skipped', summary_id]
				, onSuccess, _.transactionErrorHandler

			defer.promise()




		#Insert/update the data in quiz_response_summary if summary_id is present or not
		writeQuizResponseSummary : (model)->
			quizMetaValue= ''
			quizMeta = ''
			_.getCollectionMeta(model.get('collection_id'))
			.then (collectionMetaData)->

				if collectionMetaData.quizType is "practice"
					# quizResponseSummary = _.getQuizResponseSummaryByCollectionId(model.get('collection_id'))
					# quizResponseSummary.done (result)->
					quizMetaValue = model.get('status')
					# quizMeta = 'attempts' : result.attempts
					quizMeta = 'status' : quizMetaValue


				else
					quizMetaValue = model.get('status')
					quizMeta = 'status' : quizMetaValue


			# if typeof summary_id != 'undefined'

				if model.get('summary_id') is "" or typeof model.get('summary_id') is 'undefined'
					_.insertIntoQuizResponseSummary(model, quizMeta, collectionMetaData)

				else
					_.updateIntoQuizResponseSummary(model,quizMeta)


		insertIntoQuizResponseSummary : (model,quizMetaValue, collectionMetaData)->

			summary_id = 'Q'+model.get('collection_id')+'S'+_.getUserID()
			if collectionMetaData.quizType is "practice"
				summary_id = summary_id+'_'+_.getCurrentDateTime(0)

			console.log JSON.stringify quizMetaValue
			model.set 'summary_id' :summary_id

			serializeQuizMetaValue = serialize(quizMetaValue)
			start_date = _.getCurrentDateTime(0)

			_.db.transaction((tx)->

				tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_response_summary 
					(summary_id, collection_id, student_id, quiz_meta, taken_on, sync) 
					VALUES (?,?,?,?,?,?)"
					, [summary_id, model.get('collection_id'), _.getUserID()
					, serializeQuizMetaValue, start_date, 0])

			,_.transactionErrorHandler

			,(tx)->
				console.log 'Inserted data in quiz_response_summary'
			)

		abc : ()->

			_.db.transaction (tx)->
				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"quiz_response_summary ", []
					, (tx,results)->
						result = new Array()
						# if results.length>0
						for i in [0..results.rows.length-1] by 1
							result[i] = results.rows.item(i)
						
						# alert "final"
						console.log result

					, _.transactionErrorHandler)


		updateIntoQuizResponseSummary : (model,quizMeta)->
			summary_id = model.get('summary_id')

			serializeQuizMetaValue = serialize(quizMeta)

			_.db.transaction((tx)->

				tx.executeSql("UPDATE "+_.getTblPrefix()+"quiz_response_summary SET 
					quiz_meta=?, sync=? 
					WHERE summary_id=?"
					, [serializeQuizMetaValue, 0, summary_id])

			,_.transactionErrorHandler

			,(tx)->
				console.log 'Updated data in quiz_response_summary'
			)


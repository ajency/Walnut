define ['underscore', 'unserialize'], ( _) ->


	_.mixin

		getQuizResponseSummaryByCollectionIdAndUserID : (collection_id)->

			runQuery = ->
				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT taken_on, quiz_meta, summary_id 
							FROM "+_.getTblPrefix()+"quiz_response_summary WHERE collection_id=? 
							AND student_id=?", [collection_id, _.getUserID()] 
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->

				(tx,data)->

					result = ''
					row = data.rows.item(0)

					#if row['quiz_meta']
					quiz_meta = _.unserialize(row['quiz_meta'])
					quizResponseSummary = _.getQuizResponseSummaryByCollectionId(collection_id)
					quizResponseSummary.done (quiz_responses)->
						
						countForSkippedQuestion = _.getCountForSkippedQuestion()
						countForSkippedQuestion.done (skipped)->

							totalMarksScoredAndTotalTimeTaken = _.getTotalMarksScoredAndTotalTimeTaken(row['summary_id'])
							totalMarksScoredAndTotalTimeTaken.done (value)->


								result = 
									collection_id : collection_id
									marks_scored: value.marks_scored
									negative_scored: value.negative_scored
									num_skipped: skipped
									questions_order:quiz_meta.questions_order
									status : quiz_meta.status
									student_id : _.getUserID()
									summary_id : row['summary_id']
									taken_on : row['taken_on']
									total_marks_scored : value.total_marks_scored
									total_time_taken : value.total_time_taken

								d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuizResponseSummaryByCollectionIdAndUserID transaction completed'
			.fail _.failureHandler


		getCountForSkippedQuestion : ->

			runQuery = ->
				$.Deferred (d)->
					
					_.db.transaction (tx)->
						tx.executeSql("SELECT count(status) AS num_skipped
							FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE status=?", ["skipped"]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess =(d)->
				(tx,data)->

					result = data.rows.item(0)['num_skipped']

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getCountForSkippedQuestion transaction completed'
			.fail _.failureHandler



		#Insert/update the data in quiz_response_summary if summary_id is present or not
		writeQuizResponseSummary : (model)->
			quizMetaValue= ''
			quizMeta = ''
			collectionMeta = _.getCollectionMeta(model.get('collection_id'))
			collectionMeta.done (collectionMetaData)->

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
				_.insertIntoQuizResponseSummary(model,quizMeta)

			else
				_.updateIntoQuizResponseSummary(model,quizMeta)


		insertIntoQuizResponseSummary : (model,quizMetaValue)->

			summary_id = 'Q'+model.get('collection_id')+'S'+_.getUserID()

			serializeQuizMetaValue = serialize(quizMetaValue)
			start_date = _.getCurrentDateTime(0)

			_.db.transaction((tx)->

				tx.executeSql("INSERT INTO "+_.getTblPrefix()+"quiz_response_summary (summary_id
					, collection_id, student_id, quiz_meta, taken_on, sync) 
					VALUES (?,?,?,?,?,?)"
					, [summary_id, model.get('collection_id'), _.getUserID()
					, serializeQuizMetaValue, start_date], 0)

			,_.transactionErrorhandler

			,(tx)->
				console.log 'Inserted data in quiz_response_summary'
				model.set 'summary_id' :summary_id
			)


		updateIntoQuizResponseSummary : (model,quizMeta)->

			serializeQuizMetaValue = serialize(quizMeta)

			_.db.transaction((tx)->

				tx.executeSql("UPDATE "+_.getTblPrefix()+"quiz_response_summary SET 
					quiz_meta=?, sync=? 
					WHERE summary_id=?"
					, [serializeQuizMetaValue, 0, model.get('summary_id')])

			,_.transactionErrorhandler

			,(tx)->
				model.set 'summary_id' :summary_id
				console.log 'Updated data in quiz_response_summary'
			)


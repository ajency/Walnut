define ['underscore', 'unserialize'], ( _) ->


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
									marks_scored : value.total_marks_scored
									qr_id: row['qr_id']
									question_response : _.unserialize(row['question_response'])
									status : row['status']
									summary_id :summary_id
									time_taken : value.total_time_taken

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuizQuestionResponseBySummaryID transaction completed'
			.fail _.failureHandler




		getTotalMarksScoredAndTotalTimeTaken : (summary_id)->

			runQuery = ->

				$.Deferred (d)->

					_.db.transaction (tx)->
						tx.executeSql("SELECT SUM(marks_scored) as total_marks_scored, 
							SUM(time_taken) as total_time_taken 
							FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE summary_id = ?", 
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



		getQuestionResponseBySummaryID : (summary_id)->

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
									marks_scored : value.total_marks_scored
									qr_id: row['qr_id']
									question_response : _.unserialize(row['question_response'])
									status : row['status']
									summary_id :summary_id
									time_taken : value.total_time_taken

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuestionResponseBySummaryID transaction completed'
			.fail _.failureHandler
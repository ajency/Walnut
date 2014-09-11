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

					quiz_meta = _.unserialize(row['quiz_meta'])

					result = 
						collection_id : collection_id
						status : quiz_meta.status
						num_skipped: "9"
						student_id : _.getUserID()
						summary_id : row['summary_id']
						taken_on : row['taken_on']
						total_marks_scored : ""
						total_time_taken : ""

					d.resolve(result)

			$.when(runQuery()).done ->
				console.log 'getQuizResponseSummaryByCollectionIdAndUserID transaction completed'
			.fail _.failureHandler
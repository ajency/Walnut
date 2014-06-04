define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		# Get total number of records from table "sync_details" based on type_of_operation
		getTotalSyncDetailsCount : (operation) ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(*) AS count FROM sync_details 
							WHERE type_of_operation=?", [operation]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					count = data.rows.item(0)['count']
					d.resolve count

			$.when(runQuery()).done ->
				console.log 'getTotalSyncDetailsCount transaction completed'
			.fail _.failureHandler
			

		# Get total records from tables wp_training_logs, wp_question_response
		# and wp_question_response_logs where sync=0 
		getTotalRecordsTobeSynced : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT SUM(rows) AS total FROM 
							(SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"training_logs 
							WHERE sync=? UNION ALL 
							SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response 
							WHERE sync=? UNION ALL 
							SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response_logs 
							WHERE sync=?)", [0,0,0], onSuccess(d), _.deferredErrorHandler(d))


			onSuccess = (d)->
				(tx, data)->
					totalRecords= data.rows.item(0)['total']
					d.resolve totalRecords

			$.when(runQuery()).done ->
				console.log 'getTotalRecordsTobeSynced transaction completed'
			.fail _.failureHandler					

				

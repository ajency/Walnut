define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		#Get the last sync operation from table 'sync_details'
		getLastSyncOperation : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT type_of_operation FROM sync_details 
							ORDER BY id DESC LIMIT 1", []
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					last_operation = 'none'
					if data.rows.length isnt 0
						last_operation = data.rows.item(0)['type_of_operation']
					
					d.resolve last_operation

			$.when(runQuery()).done ->
				console.log 'getLastSyncOperation transaction completed'
			.fail _.failureHandler
			

		# Get total records from tables wp_training_logs, wp_question_response
		# and wp_question_response_logs where sync=0 
		getTotalRecordsTobeSynced : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT COUNT(*) AS total 
							FROM "+_.getTblPrefix()+"question_response 
							WHERE sync=?", [0], onSuccess(d), _.deferredErrorHandler(d))


			onSuccess = (d)->
				(tx, data)->
					totalRecords= data.rows.item(0)['total']
					d.resolve totalRecords

			$.when(runQuery()).done ->
				console.log 'getTotalRecordsTobeSynced transaction completed'
			.fail _.failureHandler


		# Get last sync time_stamp based on type_of_operation
		getLastSyncTimeStamp : (operation) ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT time_stamp FROM sync_details 
							WHERE type_of_operation=? ORDER BY id DESC LIMIT 1", [operation]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					time_stamp = ''
					if data.rows.length isnt 0
						time_stamp = data.rows.item(0)['time_stamp']
					
					d.resolve time_stamp

			$.when(runQuery()).done ->
				console.log 'getLastSyncTimeStamp transaction completed'
			.fail _.failureHandler

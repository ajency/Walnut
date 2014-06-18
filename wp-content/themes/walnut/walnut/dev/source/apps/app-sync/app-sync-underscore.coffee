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
			

		# Get total records from wp_question_response where sync=0 
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


		# Get last download time_stamp
		getLastDownloadTimeStamp : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT time_stamp FROM sync_details 
							WHERE type_of_operation=? ORDER BY id DESC LIMIT 1"
							, ['file_download'], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					time_stamp = ''
					if data.rows.length isnt 0
						time_stamp = data.rows.item(0)['time_stamp']
					
					d.resolve time_stamp

			$.when(runQuery()).done ->
				console.log 'getLastDownloadTimeStamp transaction completed'
			.fail _.failureHandler


		
		#Update 'sync_details' table after every file operation
		updateSyncDetails : (operation, time_stamp)->

			_.db.transaction((tx)->
				tx.executeSql("INSERT INTO sync_details (type_of_operation, time_stamp) 
					VALUES (?,?)", [operation, time_stamp])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Updated sync details for '+operation
			)


		#This method decrypts the encrpted file and saves it in the path specified
		decryptTheEncryptedFile :(encryptPathValue, decryptPathValue) ->
			#This will decrypt the encrypted path
			decrypt.startDecryption(encryptPathValue, decryptPathValue
				, ->
					alert "The file was Successfully Decrypted"

				, (message) ->
					alert "Error! " + message
			)


		#This method deletes the decrypted file
		deleteTheDecryptedFile : (decryptPathValue)->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
				,(fileSystem)=>
					fileSystem.root.getFile(decryptPathValue
						, {create: false, exclusive: false}

						,(fileEntry)->
							fileEntry.remove(
								(fileEntry)->
									console.log "Deleted Successfully"
								,(error)->
									console.log "error"
							)
						,_.fileErrorHandler)

				, _.fileSystemErrorHandler)

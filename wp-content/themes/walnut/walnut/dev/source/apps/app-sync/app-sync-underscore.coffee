define ['underscore', 'unserialize'], ( _) ->

	_.mixin

		
		onDataSyncError  : (error, message)->

			console.log 'ERROR: '+error.code if error isnt 'none'

			$('#syncSuccess').css("display","none")

			$('#syncStartContinue').css("display","block")

			$('#syncButtonText').text("Try again")

			$('#syncError').css("display","block").text(""+message)


		
		onMediaSyncError : (error, message)->

			console.log 'ERROR: '+error.code if error isnt 'none'

			$('#syncMediaSuccess').css("display","none")

			$('#syncMediaStart').css("display","block")

			$('#syncMediaButtonText').text("Try again")

			$('#syncMediaError').css("display","block").text(""+message)



		#Get the last sync operation from table 'sync_details'
		getLastSyncOperation : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT type_of_operation FROM sync_details 
							WHERE user_id=? ORDER BY id DESC LIMIT 1" , [_.getUserID()]
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
		

		hasUserPreviouslySynced : ->

			synced = false

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT id FROM sync_details WHERE user_id=?" 
							, [_.getUserID()]
							, onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					if data.rows.length isnt 0

						synced = true
					
					d.resolve synced

			$.when(runQuery()).done ->
				console.log 'hasUserPreviouslySynced transaction completed'
			.fail _.failureHandler
		
		# Get total records from wp_question_response where sync=0 
		getTotalRecordsTobeSynced : ->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT SUM(rows) AS total FROM 
							(SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"quiz_question_response 
							WHERE sync=? UNION ALL
							SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"quiz_response_summary 
							WHERE sync=?)"
							, [0, 0], onSuccess(d), _.deferredErrorHandler(d))


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
							WHERE type_of_operation=? AND user_id=? ORDER BY id DESC LIMIT 1"
							, ['file_download', _.getUserID()], onSuccess(d), _.deferredErrorHandler(d))

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
				tx.executeSql("INSERT INTO sync_details (type_of_operation, time_stamp, user_id) 
					VALUES (?,?,?)", [operation, time_stamp, _.getUserID()])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Updated sync details for '+operation
			)


		
		#Delete all files from 'SynapseData' directory
		clearSynapseDataDirectory : ->

			value = _.getStorageOption()
			option = JSON.parse(value)
			if option.internal
				filepath = option.internal
			else if option.external
				filepath = option.external
		   
			window.resolveLocalFileSystemURL('file://'+filepath+'', (fileSystem)->
				fileSystem.getDirectory("SynapseAssets/SynapseData"
					, {create: false, exclusive: false}

					, (directoryEntry)->
						reader = directoryEntry.createReader()
						reader.readEntries(
							(entries)->
								for i in [0..entries.length-1] by 1
									entries[i].remove()

									if i is entries[i].length-1
										console.log "Deleted all files from 'SynapseData' directory"

							,_.directoryErrorHandler)
					
					, _.directoryErrorHandler)
			
			, _.fileSystemErrorHandler)


		# Get available phone memory space in KB
		getAvailableDeviceStorageSize : ->

			runFunc = ->
				$.Deferred (d)->

					cordova.exec((freeSpace)->

							d.resolve(freeSpace)

						,->
							console.log('DeviceStorageSize Failed')

						,"File", "getFreeDiskSpace", [])


			$.when(runFunc()).done ->
				console.log('getDeviceAvailableStorageSize done')
			.fail _.failureHandler


		# Get List of textbook ids for user
		getTextbookIdsByClassID : ->

			runQuery = ->
				$.Deferred (d)->
					
					classID = _.getClassIdForUser()
					classID.done (class_id)->

						_.db.transaction (tx)->
							pattern = '%"'+class_id+'"%' 

							tx.executeSql("SELECT textbook_id FROM wp_textbook_relationships 
								WHERE class_id LIKE '%"+pattern+"%'"
								, [], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					textbook_ids = new Array()

					
					for i in [0..data.rows.length-1] by 1
						textbook_ids[i] = data.rows.item(i)['textbook_id']
					
					d.resolve textbook_ids


			$.when(runQuery()).done ->
				console.log 'getTextbookIdsByClassID transaction completed'
			.fail _.failureHandler
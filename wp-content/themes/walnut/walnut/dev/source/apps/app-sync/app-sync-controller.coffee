define ["marionette","app", "underscore", "csvparse"], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->


		startSync : ->
			@Sync()

		#This function will get the file from device root and then download the data from the server and write it to the device file
		TotalRecordsUpdate : ->

			_.db.transaction( (tx)->
				tx.executeSql("SELECT SUM(rows) AS total FROM (
					SELECT COUNT(*) AS rows FROM wp_training_logs WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM wp_question_response WHERE sync=?
					UNION ALL 
					SELECT COUNT(*) AS rows FROM wp_question_response_logs WHERE sync=?)", [0,0,0]

					,(tx, data)->
						total = data.rows.item(0)['total']
						$('#SyncRecords').text(total)

					,_.transactionErrorhandler
				)

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Fetched all records where sync=0'
			)


		Sync : ->
			files = ["http://synapsedu.info/wp_35_training_logs.csv", "http://synapsedu.info/wp_35_question_response.csv" ,"http://synapsedu.info/wp_35_question_response_logs.csv"]
			currData =0
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("StudentsLogs.csv", {create: true, exclusive: false}

						, (fileEntry)=>
							# fileUrl= fileEntry.toURL()
							filePath1=["/WpTrainingLogs.csv", "/wp_35_question_response.csv", "/wp_35_question_response_logs.csv"]
							for i in [0..files.length-1] by 1
								currentFileIndex = i
								alert "val" +i
								alert "new file is" +filePath1[i]
								alert "file is " +fileEntry.toURL()
								fileEntry = fileUrl+filePath1[i]
								alert "file entry" +fileEntry
								console.log "initiate download of file index " + i + " File Name: " + files[i]
								@DownlaodFiles files[i], fileEntry

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)


		# readAsText : ->
		# 	alert 'readAsText'
	
		DownlaodFiles : (files , fileEntry)->
			fileTransfer = new FileTransfer()
			uri = files
			filePath=fileEntry
			alert filePath
			fileTransfer.download(uri, filePath
				,(file)=>
					console.log 'File downloaded'+file
					@readAsText file

				,_.fileTransferErrorHandler, true)

		#This function raeds the file as text and Parse the .csv file to array f aarys who's result is sent through the function SendParsedData

		readAsText : (file)->
			console.log "read files" +file.toURL()
			reader = new FileReader()
			reader.onloadend = (evt)->
				alert "result" +evt.target.result
				alert "csvString" +csvString
				csvString = evt.target.result
				parsedData = $.parse(csvString, {
					header : false
					dynamicTyping : false
					})
				console.log "result is "+parsedData.results
				@SendParsedData parsedData.results

			reader.readAsText file

	#This function Inserts the data in the Database

		SendParsedData : (data)->

			_.db.transaction( (tx)->

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status, sync) 
						VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], 1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data inserted successfully'
				# @readValues
			)
			_.db.transaction( (tx)->

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("INSERT INTO wp_question_response (ref_id,content_piece_id,collection_id,division,question_response,time_taken,start_date,end_date,status,sync) 
						VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], 1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data inserted successfully'
				
			)
			_.db.transaction( (tx)->

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("INSERT INTO wp_question_response_logs (qr_ref_id, start_time, sync) 
						VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], 1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data inserted successfully'
				
			)
		@readValues

	#This function Reads the inserted data

		readValues : ()->
			window.db.transaction( (transaction)->
				alert "SELECT"
				transaction.executeSql("SELECT * FROM wp_training_logs ", [], (transaction, results)->
					valuesAll = results.rows.length;
					console.log valuesAll
					if valuesAll == 0 
						console.log "No user found"
						#return;
					
					else
						
						i= 0
						while i < valuesAll
							row = results.rows.item(i)
							data = row.id
							data1 =results.rows.item(i).division_id
							data2 =results.rows.item(i).collection_id
							data3 =results.rows.item(i).teacher_id 
							data4 =results.rows.item(i).date
							data5 =results.rows.item(i).status
							console.log data
							console.log data1
							console.log data2
							console.log data3
							console.log data4
							console.log data5
							console.log i
							i++
							

											
				,_.transactionErrorhandler
					
				)
			)



	# request handler
	App.reqres.setHandler "get:sync:controller", ->
		new SynchronizationController
define ["marionette","app", "underscore", "csvparse" , "json2csvparse" ], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->


		startSync : ->
			@Sync()

		
		totalRecordsUpdate : ->

			_.db.transaction( (tx)->
				tx.executeSql("SELECT SUM(rows) AS total FROM 
					(SELECT COUNT(*) AS rows FROM wp_training_logs WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM wp_question_response WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM wp_question_response_logs WHERE sync=?)", [0,0,0]

				,(tx, data)->
					$('#SyncRecords').text(data.rows.item(0)['total'])

				,_.transactionErrorhandler
				)

			_.transactionErrorhandler
			,(tx)->
				console.log 'Fetched total records having sync flag=0'
			)

		Conversion : ->
			valuesAll=""
			valuesAll1=""
			valuesAll2=""
			_.db.transaction((tx)=>
				tx.executeSql("SELECT * FROM wp_training_logs WHERE sync=0 ", [] 

					,(tx, results)->
						valuesAll = results.rows.length;
						console.log valuesAll
						if valuesAll is 0 
							console.log "No user found"
							# return;
						
						else
							
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								data = row.id
								training_data = '{ "id": "'+row.id+'","division_id":"'+row.division_id+'", "collection_id": "'+row.collection_id+'", "teacher_id": "'+row.teacher_id+'", "date":"'+row.date+'", "status":"'+row.status+'"}'
								console.log "1st data is :" +training_data
								i++				
					
					,_.transactionErrorhandler)

				tx.executeSql("SELECT * FROM wp_question_response WHERE sync=0 ", []

					,(tx, results)->
						valuesAll1 = results.rows.length;
						console.log valuesAll1
						if valuesAll is 0 
							console.log "No user found"
							#return;
						
						else
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								quest_resp_data = '{ "grp_name": "'+row.ref_id+'","grp_des":"'+row.content_piece_id+'", "grp_recuring": "'+row.collection_id+'", "grp_type": "'+row.division+'", "grp_currency":"'+row.question_response+'", "grp_chat":"'+row.time_taken+'","grp_chat":"'+row.start_date+'""grp_chat":"'+row.end_date+'""grp_chat":"'+row.status+'""grp_chat":"'+row.sync+'"}'
								console.log "2n Data is " +quest_resp_data
								i++		
					
					,_.transactionErrorhandler)

				tx.executeSql("SELECT * FROM wp_question_response_logs WHERE sync=0 ", []

					, (tx, results)=>
						valuesAll2 = results.rows.length;
						console.log valuesAll2
						if valuesAll == 0 
							console.log "No user found"

							items = [
								{ name: "Item 1", color: "Green", size: "X-Large" },
								{ name: "Item 2", color: "Green", size: "X-Large" },
								{ name: "Item 3", color: "Green", size: "X-Large" }]
							
							AllData = {"group":{"training_data":items, "quest_resp_data":items, 
							"quesn_rep_logs": items}}
							fullGrp = JSON.stringify items
							alert fullGrp
							console.log "Ful Data is " +fullGrp
							CSVdata = ConvertToCSV fullGrp
							console.log "CSV data is" +CSVdata
							
							alert "hello cald not"
							@WriteToFile CSVdata
							#return;
						
						else
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								quesn_rep_logs = '{ "id": "'+row.qr_ref_id+'","collection_id": "'+row.start_time+'", "teacher_id": "'+row.sync+'"}'
								console.log "3rd data is "+quesn_rep_logs
								i++

								# $('#SyncRecords').text(VALUESGT)
								# AllData = training_data+quest_resp_data+quesn_rep_logs
									# AllData = {"group":{"training_data":training_data, "quest_resp_data":quest_resp_data, 
									# "quesn_rep_logs": quesn_rep_logs}}
									
									# fullGrp = '&data='+JSON.stringify AllData
									# alert fullGrp
									# console.log "Ful Data is " +fullGrp
									# CSVdata = ConvertToCSV(fullGrp)
									# console.log "CSV data is" +CSVdata


					,_.transactionErrorhandler)
			
			,_.transactionErrorhandler
			,(tx)->
				console.log 'Main transaction'
			)

		WriteToFile : (CSVdata)->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("csvread.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.createWriter(

								(writer)=>
									console.log "file entry is" +fileEntry.toURL()
									writer.write(CSVdata)
									$('#JsonToCSV').attr("disabled","disabled")
									$('#CSVupload').removeAttr("disabled")
									@fileRead()

								, _.fileTransferErrorHandler)
							

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

		fileRead : ->
			alert ("hiee")
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("csvread.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.file(

								(file)=>
									alert "read as text"
									alert "reader " +reader
									reader = new FileReader()
									reader.onloadend = (evt)->
										alert "result" +evt.target.result
										console.log "result" +evt.target.result
									reader.readAsText file

								, _.fileErrorHandler)

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)


			
	

		FileUpload: (fileEntry)->
			options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=fileEntry.substr(fileEntry.lastIndexOf('/') + 1);
			options.mimeType="text/csv;";
			
			params = {};
			params.value1 = "test";
			params.value2 = "param";

			options.params = params;

			ft = new FileTransfer();
			ft.upload(fileEntry, encodeURI("http://some.server.com/upload.php")
				, (r)->
					console.log "Code = " + r.responseCode
					console.log "Response = " + r.response
					console.log "Sent = " + r.bytesSent

				, (error)->
					alert "An error has occurred: Code = " + error.code
					console.log "upload error source " + error.source
					console.log "upload error target " + error.target

				, options)


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
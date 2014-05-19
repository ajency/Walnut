define ["marionette","app", "underscore", "csvparse"], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->

		startSync : ->
			@Sync()

		#This function will get the file from device root and then download the data from the server and write it to the device file
		TotalRecordsUpdate : ->
			_.db.transaction( (tx)->
				alert "SELECT"
				tx.executeSql("SELECT * FROM wp_training_logs ", [], (tx, results)->
					valuesAll = results.rows.length;
					console.log valuesAll					
				,_.transactionErrorhandler
					
				)
			)


		Sync : ->
			files = ["http://synapsedu.info/wp_35_training_logs.csv", "http://synapsedu.info/wp_35_question_response.csv" ,"wp_35_question_response_logs.csv"]
			alert files
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("StudentsLogs.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileTransfer = new FileTransfer()
							uri = files
							filePath=fileEntry.toURL()

							fileTransfer.download(uri, filePath
								,(file)=>
									console.log 'File downloaded'
									@readAsText file

								,_.fileTransferErrorHandler, true)

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)


		# readAsText : ->
		# 	alert 'readAsText'

		

		#This function raeds the file as text and Parse the .csv file to array f aarys who's result is sent through the function SendParsedData

		readAsText : (file)->
			for i in [0..file.length-1] by 1
				currentFileIndex = i
				console.log "initiate download of file index " + i + " File Name: " + files[i]
				files[i]
			console.log "read files"
			reader = new FileReader()
			reader.onloadend = (evt)->

				csvString = evt.target.result
				parsedData = $.parse(csvString, {
					header : false
					dynamicTyping : false
					})

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
				@readValues
			)

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
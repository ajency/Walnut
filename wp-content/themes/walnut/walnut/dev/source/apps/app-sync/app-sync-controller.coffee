define ["marionette","app", "underscore", "csvparse" ,"archive", "jszipUtils", "jszipLoad", "json2csvparse", "Zip", "zipchk", "FileSaver"], (Marionette, App, _, parse, getEntries, JSZipUtils,load) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->


		startSync : ->
			@dwnldUnZip()

		
		totalRecordsUpdate : =>

			_.db.transaction( (tx)=>
				tx.executeSql("SELECT SUM(rows) AS total FROM 
					(SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"training_logs WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response_logs WHERE sync=?)", [0,0,0]

				,(tx, data)=>
					$('#SyncRecords').text(data.rows.item(0)['total'])
					alert total
					_.setTotalRecords(total)
					@chkTotalrecords total

				,_.transactionErrorhandler
				)

			_.transactionErrorhandler
			,(tx)=>
				console.log 'Fetched total records having sync flag=0'
				
			)

		chkTotalrecords :(total) ->
			alert "total is"+total
			if total is 0
				$('#JsonToCSV').attr("disabled","disabled")
				$('#CSVupload').attr("disabled","disabled")
				$('#syncNow').removeAttr("disabled")
			else
				$('#JsonToCSV').removeAttr("disabled")
				$('#CSVupload').attr("disabled","disabled")
				$('#syncNow').attr("disabled","disabled")

#This function Selects those record from the 3 tables which has sync flag set as 0
#The Function is too long after succesful execution change it by calling differnt function for eavh transaction
		
		selectRecords : ->
			valuesAll = ""
			valuesAll1 = ""
			valuesAll2 = ""
			_.db.transaction((tx)=>
				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"training_logs WHERE sync=0 ", [] 

					,(tx, results)->
						valuesAll = results.rows.length;
						console.log valuesAll
						if valuesAll is 0 
							console.log "No user found"
						
						else
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								data = row.id
								training_data = '{ "id": "'+row.id+'","division_id":"'+row.division_id+'", "collection_id": "'+row.collection_id+'", "teacher_id": "'+row.teacher_id+'", "date":"'+row.date+'", "status":"'+row.status+'"}'
								console.log "1st data is :" +training_data
								i++				
					
					,_.transactionErrorhandler)

				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response WHERE sync=0 ", []

					,(tx, results)->
						valuesAll1 = results.rows.length;
						console.log valuesAll1
						if valuesAll is 0 
							console.log "No user found"
						
						else
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								quest_resp_data = '{ "ref id": "'+row.ref_id+'","content id":"'+row.content_piece_id+'", "collection id": "'+row.collection_id+'", "division": "'+row.division+'", "question response":"'+row.question_response+'", "time taken":"'+row.time_taken+'","start date":"'+row.start_date+'""end date":"'+row.end_date+'""status":"'+row.status+'""sync":"'+row.sync+'"}'
								console.log "2n Data is " +quest_resp_data
								i++		
					
					,_.transactionErrorhandler)

				tx.executeSql("SELECT * FROM "+_.getTblPrefix()+"question_response_logs WHERE sync=0 ", []

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
							console.log "Ful Data is " +fullGrp
							CSVdata = ConvertToCSV fullGrp
							console.log "CSV data is" +CSVdata							
							@writeToFile CSVdata

						
						else
							i= 0
							while i < valuesAll
								row = results.rows.item(i)
								quesn_rep_logs = '{ "id": "'+row.qr_ref_id+'","collection_id": "'+row.start_time+'",
								 "teacher_id": "'+row.sync+'"}'
								console.log "3rd data is "+quesn_rep_logs
								i++

							AllData = training_data+quest_resp_data+quesn_rep_logs
							AllData = {"group":{"training_data":training_data, "quest_resp_data":quest_resp_data, 
							"quesn_rep_logs": quesn_rep_logs}}
								
							fullGrp = JSON.stringify AllData
							alert fullGrp
							console.log "Ful Data is " +fullGrp
							CSVdata = ConvertToCSV fullGrp
							console.log "CSV data is" +CSVdata
							@writeToFile CSVdata

					,_.transactionErrorhandler)
			
			,_.transactionErrorhandler
			,(tx)->
				console.log 'Main transaction'
			)

#This function Creates a file and writes into it the the record provided selectRecords function

		writeToFile : (CSVdata)->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/csvread.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.createWriter(

								(writer)=>
									alert "file entry is" +fileEntry.toURL()
									console.log "file entry is" +fileEntry.toURL()
									writer.write(CSVdata)
									@updateSync()
									

								, _.fileTransferErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)



#This function will update the sync flag to 1 in the respective tables and disable the generate and download button and enable upload button
		updateSync: =>

			_.db.transaction( (tx)=>
				alert "insert id "+results.insertId
				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE "+_.getTblPrefix()+"_training_logs SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)=>
				console.log 'Data updated successfully'
				@updateQuestRespn()
				# @readValues
			)

		updateQuestRespn: =>

			_.db.transaction( (tx)=>

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE "+_.getTblPrefix()+"_question_response SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)=>
				console.log 'Data updated successfully'
				@updateQuestRespnLogs()
				
			)

		updateQuestRespnLogs : =>

			_.db.transaction( (tx)=>

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE "+_.getTblPrefix()+"_question_response_logs SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)=>
				console.log 'Data updated successfully'
				$('#SyncRecords').text(0)
				$('#JsonToCSV').attr("disabled","disabled")
				$('#CSVupload').removeAttr("disabled")
				$('#syncNow').attr("disabled","disabled")
				@fileRead()
				
			)

#This function reads thee contents written in above created file

		fileRead : ->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/csvread.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.file(

								(file)=>
									reader = new FileReader()
									reader.onloadend = (evt)=>
										alert "result" +evt.target.result
										csvData = evt.target.result
										console.log "result" +evt.target.result
										@ZipFile csvData

									reader.readAsText file

								, _.fileErrorHandler)

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)


#Function to Zip the .csv File
		ZipFile : (csvData)=>
			zip = new JSZip();
			zip.file("csvread.txt", csvData)
			content = zip.generate({type:"text/plain"});
			zip.file("csvread.txt").asText()
			@saveZipData content


		saveZipData : (content)->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/hello.zip", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.createWriter(

								(writer)=>
									alert "file entry is" +fileEntry.toURL()
									console.log "file entry is" +fileEntry.toURL()
									writer.write(content)


								, _.fileTransferErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

		fileReadZip : ->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/hello.zip", null

						, (fileEntry)=>

							fileEntry.file(

								(file)=>
									reader = new FileReader()
									reader.onloadend = (evt)=>
										alert "result" +evt.target.result
										csvData = evt.target.result
										console.log "result" +evt.target.result
										@fileUpload fileEntry
									reader.readAsText file

								, _.fileErrorHandler)

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

# Download the zip file from the server and extract its contents
		dwnldUnZip : ->
			uri = encodeURI(_.getDwnlduri())

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/logs.zip", {create: true, exclusive: false}

						,(fileEntry)=>
							filePath = fileEntry.toURL().replace("logs.zip", "")
							fileEntry.remove()
							fileTransfer = new FileTransfer()
							fileTransfer.download(uri, filePath+"logs.zip" 
								,(file)=>
									
									@fileUnZip filePath, file.toURL()
								
								,_.fileTransferErrorHandler, true)

						,_.fileErrorHandler)


				, _.fileSystemErrorHandler)

		chkReader : (file1)->
			read = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

						, (fileSystem)=>

							fileSystem.root.getFile(file1, {create: false}

								, (fileEntry)=>
									fileEntry.file(

										(file)=>
											console.log "is"+file
											reader = new FileReader()
											reader.onloadend = (evt)=>
												
												csvString = evt.target.result
												parsedData = $.parse(csvString, {
													header : false
													dynamicTyping : false
													})
												
												d.resolve parsedData.results

											reader.readAsText file

										, _.fileErrorHandler)

									
								, _.fileErrorHandler)

						, _.fileSystemErrorHandler)

			$.when(read()).done ->
				console.log 'read done'
			.fail _.failureHandler			

		fileUnZip : (filePath, fullpath)->
			filePath=filePath
			fullpath=fullpath
			console.log 'Source: '+fullpath
			console.log 'Destination: '+filePath

			success =()=>
				console.log 'Files unzipped'
				@readUnzipFile1 filePath


			zip.unzip(fullpath, filePath, success)




		readUnzipFile1 : (filePath)->
				file = 	 "SynapseAssets/wp_3_class_divisions.csv"

				@sendParsedData1 file ,filePath
				


		
#14 insert functions
		sendParsedData1 : (file, fileEntry)=>
			fileEntry=fileEntry
			readData = @chkReader(file)
			readData.done (data)=>
				# console.log "parsed data"+data
			
				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_3_class_divisions (id, division, class_id) 
							VALUES (?, ?, ?)", [data[i][1], data[i][2], data[i][3]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully1'
					file1 =  "SynapseAssets/"+_.getTblPrefix()+"question_response.csv"
					@sendParsedData2 file1 ,fileEntry

				)




		sendParsedData2 : (file1, fileEntry)=>
			fileEntry=fileEntry
			readData = @chkReader(file1)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"question_response (content_piece_id, collection_id, division,question_response,time_taken,start_date,end_date,status) 
							VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)", [ data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully2'
					file14 =  "SynapseAssets/"+_.getTblPrefix()+"question_response_logs.csv"
					@sendParsedData15 file14 ,fileEntry

				)
		sendParsedData15 : (file14, fileEntry)=>
			fileEntry=fileEntry
			readData = @chkReader(file14)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"question_response_logs (start_time) 
							VALUES ( ?)", [data[i][2]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully15'
					file2 =  "SynapseAssets/"+_.getTblPrefix()+"training_logs.csv"
					@sendParsedData3 file2 ,fileEntry

				)

		sendParsedData3 : (file2, fileEntry)=>
			readData = @chkReader(file2)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"training_logs ( division_id,collection_id, teacher_id, date,status) 
							VALUES ( ?,?, ?, ?,?)", [ data[i][2],data[i][3],data[i][4],data[i][5]],data[i][6])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully3'
					file3 =  "SynapseAssets/wp_collection_meta.csv"
					@sendParsedData4 file3 ,fileEntry

				)
		sendParsedData4 : (file3, fileEntry)=>
			readData = @chkReader(file3)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_collection_meta (id, collection_id, meta_key, meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully4'
					file4 =  "SynapseAssets/wp_content_collection.csv"
					@sendParsedData5 file4 ,fileEntry

				)

		
		sendParsedData5 : (file4, fileEntry)=>
			readData = @chkReader(file4)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_content_collection (id, name, created_on, created_by, last_modified_on,last_modified_by,published_on,published_by, status,type,term_ids,duration) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10],data[i][11], data[i][12]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully5'
					file5 =  "SynapseAssets/wp_options.csv"
					@sendParsedData6 file5 ,fileEntry

				)

		sendParsedData6 : (file5, fileEntry)=>
			readData = @chkReader(file5)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_options (option_id, option_name, option_value, autoload) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully6'
					file6 =  "SynapseAssets/wp_postmeta.csv"
					@sendParsedData7 file6 ,fileEntry


				)
		sendParsedData7 : (file6, fileEntry)=>
			readData = @chkReader(file6)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_postmeta (meta_id, post_id, meta_key,meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully7'
					file7 =  "SynapseAssets/wp_posts.csv"
					@sendParsedData8 file7 ,fileEntry

				)

		sendParsedData8 : (file7, fileEntry)=>
			readData = @chkReader(file7)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_posts (ID,post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10],data[i][11], data[i][12], data[i][13], data[i][14], data[i][15],data[i][16], data[i][17], data[i][18], data[i][19], data[i][20],data[i][21], data[i][22], data[i][23]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully8'
					file8 =  "SynapseAssets/wp_term_relationships.csv"
					@sendParsedData9 file8 ,fileEntry

				)

		sendParsedData9 : (file8, fileEntry)=>
			readData = @chkReader(file8)
			readData.done (data)=>

				_.db.transaction( (tx)=>
					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_term_relationships (object_id,term_taxonomy_id, term_order) 
						VALUES (?, ?, ?)", [data[i][1], data[i][2], data[i][3]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully9'
					file9 =  "SynapseAssets/wp_term_taxonomy.csv"
					@sendParsedData10 file9 ,fileEntry

				)
		sendParsedData10 : (file9, fileEntry)=>
			readData = @chkReader(file9)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy, description, parent, count) 
							VALUES (?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully10'
					file10 = "SynapseAssets/wp_terms.csv"
					@sendParsedData11 file10 ,fileEntry

				)
		sendParsedData11 : (file10, fileEntry)=>
			readData = @chkReader(file10)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully11'
					file11 = "SynapseAssets/wp_textbook_relationships.csv"
					@sendParsedData12 file11 ,fileEntry

				)
		sendParsedData12 : (file11, fileEntry)=>
			readData = @chkReader(file11)
			readData.done (data)=>
				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_textbook_relationships (id, textbook_id, class_id, tags) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully12'
					file12 = "SynapseAssets/wp_usermeta.csv"
					@sendParsedData13 file12 ,fileEntry
				)
		sendParsedData13 : (file12, fileEntry)=>
			readData = @chkReader(file12)
			readData.done (data)=>
				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully13'
					file13 = "SynapseAssets/wp_users.csv"
					@sendParsedData14 file13 ,fileEntry

				)
		sendParsedData14 : (file13, fileEntry)=>
			readData = @chkReader(file13)
			readData.done (data)=>

				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename,user_email,user_url,user_registered,user_activation_key, user_status,display_name, spam,deleted) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5],data[i][6], data[i][7], data[i][8], data[i][9], data[i][10],data[i][11], data[i][12]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully14'
					$('#JsonToCSV').removeAttr("disabled")
					$('#CSVupload').attr("disabled","disabled")
					$('#syncNow').attr("disabled","disabled")
					App.execute "close:sync:view"
					_.setInitialSyncFlag('sync')
					# @updateDwnldTime()

				)


		
		updateDwnldTime :->
			timestamp = _.getDwnldTimeStamp()
			if _.getInitialSyncFlag() is null
			 
				_.db.transaction( (tx)=>

						# for i in [0..data.length-1] by 1
						# 	row = data[i]
						tx.executeSql("INSERT INTO sync_time_details (type_of_operation, time_stamp) 
							VALUES (?, ?)", [ "DownZip",8:36 ])

					,_.transactionErrorhandler
					,(tx)=>
						console.log 'Sync Data INSERTED successfully '
						App.execute "close:sync:view"
						_.setInitialSyncFlag('sync')
						# @readValues
					)
			else
				_.db.transaction( (tx)->
						tx.executeSql("UPDATE sync_time_details SET (type_of_operation,time_stamp) VALUES (?,?)", ["DownZip", 8:36 ])

				,_.transactionErrorhandler
				,(tx)->
					console.log 'Sync Data UPDATED successfully'
					App.execute "close:sync:view"
					_.setInitialSyncFlag('sync')
					# @readValues
				)




#This Function Will upload the zip file to the server

		fileUpload: (fileEntry)=>
			options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileEntry.substr(fileEntry.lastIndexOf('/') + 1);
			options.mimeType = "text/csv;";
			
			params = {};
			params.value1 = "test";
			params.value2 = "param";

			options.params = params;

			ft = new FileTransfer();
			ft.upload(fileEntry, encodeURI("http://some.server.com/upload.php")
				, (r)=>
					console.log "Code = " + r.responseCode
					console.log "Response = " + r.response
					console.log "Sent = " + r.bytesSent
					@chkForNewRecords

				, (error)->
					alert "An error has occurred: Code = " + error.code
					console.log "upload error source " + error.source
					console.log "upload error target " + error.target

				, options)

		chkForNewRecords :->
			if totalRecordsUpdate() is null
				$('#JsonToCSV').attr("disabled","disabled")
				$('#CSVupload').attr("disabled","disabled")
				$('#syncNow').removeAttr("disabled")
			else
				$('#JsonToCSV').removeAttr("disabled")
				$('#CSVupload').attr("disabled","disabled")
				$('#syncNow').attr("disabled","disabled")



	# request handler
	App.reqres.setHandler "get:sync:controller", ->
		new SynchronizationController
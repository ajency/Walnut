define ["marionette","app", "underscore", "csvparse" ,"archive", "jszipUtils", "jszipLoad"
		, "json2csvparse", "Zip", "zipchk", "FileSaver"]
		, (Marionette, App, _, parse, getEntries, JSZipUtils,load) ->

	class SynchronizationController extends Marionette.Controller

		initialize : ->


		startSync : ->
			@dwnldUnZip()
			# @Sync()

		
		totalRecordsUpdate : ->

			_.db.transaction( (tx)->
				tx.executeSql("SELECT SUM(rows) AS total FROM 
					(SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"training_logs WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response WHERE sync=? 
					UNION ALL 
					SELECT COUNT(*) AS rows FROM "+_.getTblPrefix()+"question_response_logs WHERE sync=?)", [0,0,0]

				,(tx, data)->
					$('#SyncRecords').text(data.rows.item(0)['total'])

				,_.transactionErrorhandler
				)

			_.transactionErrorhandler
			,(tx)->
				console.log 'Fetched total records having sync flag=0'
			)


#This function Selects those record from the 3 tables which has sync flag set as 0
#The Function is too long after succesful execution change it by calling differnt function for eavh transaction
		
		selectRecords : ->
			valuesAll = ""
			valuesAll1 = ""
			valuesAll2 = ""
			_.db.transaction((tx)=>
				tx.executeSql("SELECT * FROM wp_training_logs WHERE sync=0 ", [] 

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

				tx.executeSql("SELECT * FROM wp_question_response WHERE sync=0 ", []

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

					fileSystem.root.getFile("csvread.txt", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.createWriter(

								(writer)=>
									alert "file entry is" +fileEntry.toURL()
									console.log "file entry is" +fileEntry.toURL()
									writer.write(CSVdata)
									$('#JsonToCSV').attr("disabled","disabled")
									$('#CSVupload').removeAttr("disabled")
									@fileRead()

								, _.fileTransferErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

#This function reads thee contents written in above created file

		fileRead : ->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("csvread.txt", {create: true, exclusive: false}

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



#This function update the sync flag to 1 in the respective tables
		updateSync: ->

			_.db.transaction( (tx)->
				alert "insert id "+results.insertId
				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE wp_training_logs SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data updated successfully'
				# @readValues
			)

			_.db.transaction( (tx)->

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE wp_question_response SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data updated successfully'
				
			)

			_.db.transaction( (tx)->

				for i in [0..data.length-1] by 1
					row = data[i]
					tx.executeSql("UPDATE wp_question_response_logs SET (sync) VALUES (?)", [1])

			,_.transactionErrorhandler
			,(tx)->
				console.log 'Data updated successfully'
				
			)

#Function to Zip the .csv File
		ZipFile : (csvData)=>
			zip = new JSZip();
			zip.file("csvread.txt", csvData)
			content = zip.generate({type:"text/plain"});
			# content1 = ""+content
			# alert "1"+content1
			# alert "saved"
			zip.file("csvread.txt").asText()
			alert zip.file("csvread.txt").asText()
			@saveZipData content
			# filepath = "file:///data/data/com.your.company.HelloWorld/files/files/csvread.txt"
			# window.resolveLocalFileSystemURL(content1
			# 	, (fileEntry)->
			# 		alert fileEntry.name
			# 		console.log fileEntry.name
			# 	,  _.fileSystemErrorHandler)
			# window.saveAs(content, filepath+"/hello.zip");
			# window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
			# 	,(fileSystem)->
			# 		console.log fileSystem.name
			# 		console.log fileSystem.root.name
			# 	, _.fileSystemErrorHandler)
# if (JSZip.support.uint8array) {
#   zip.file("hello.txt").asUint8Array(); // Uint8Array { 0=72, 1=101, 2=108, more...}
# }			
			# alert saveAs
			# alert FileSaver.readFile
			# FileSaver.readFile("csvread.zip", (err, data)->
			# 	zip = new JSZip(data)
			# )
			# saveAs(content, "example.zip")

			# string = "This is my compression test."
			# alert "Size of sample is: " + string.length
			# compressed = LZString.compress(string);
			# alert "Size of compressed sample is: " + compressed.length
			# string = LZString.decompress(compressed);
			# alert "Sample is: " + string

		saveZipData : (content)->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("hello.zip", {create: true, exclusive: false}

						, (fileEntry)=>

							fileEntry.createWriter(

								(writer)=>
									alert "file entry is" +fileEntry.toURL()
									console.log "file entry is" +fileEntry.toURL()
									writer.write(content)
									@fileReadZip()

								, _.fileTransferErrorHandler)
							
						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

		fileReadZip : ->
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("hello.zip", null

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
			uri = encodeURI("http://synapsedu.info/wp-content/uploads/sites/7/tmp/csvs-1150220140526102131.zip")
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/logs.zip", {create: true, exclusive: false}

						,(fileEntry)=>
							filePath = fileEntry.toURL().replace("logs.zip", "")
							fileEntry.remove()
							fileTransfer = new FileTransfer()
							fileTransfer.download(uri, filePath+"logs.zip" 
								,(file)=>
									# alert file.toURL()
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
												# console.log "result" +evt.target.result
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




		# readUnzipFile : (filePath)->
		# 	file=[]
		# 	fileUnzip = ["wp_3_class_divisions.csv", "wp_3_question_response.csv", "wp_3_training_logs.csv", "wp_collection_meta.csv", "wp_content_collection.csv", "wp_options.csv", "wp_postmeta.csv", "wp_posts.csv","wp_term_relationships.csv","wp_term_taxonomy.csv","wp_terms.csv","wp_textbook_relationships.csv","wp_usermeta.csv","wp_users.csv"]
		# 	flength = fileUnzip.length
		# 	for i in [0..flength-1] by 1
		# 		# console.log fileUnzip[i]
		# 		file[i] = filePath+fileUnzip[i]
		# 		console.log file[i]
		# 		@readAllUnzipData filePath,file[i], flength
					
		readUnzipFile1 : (filePath)->
				# console.log fileUnzip[i]
				file = 	 "SynapseAssets/wp_3_class_divisions.csv"
				file1 =  "SynapseAssets/wp_3_question_response.csv"
				file14 =  "SynapseAssets/wp_3_question_response_logs.csv"
				file2 =  "SynapseAssets/wp_3_training_logs.csv"
				file3 =  "SynapseAssets/wp_collection_meta.csv"
				file4 =  "SynapseAssets/wp_content_collection.csv"
				file5 =  "SynapseAssets/wp_options.csv"
				file6 =  "SynapseAssets/wp_postmeta.csv"
				file7 =  "SynapseAssets/wp_posts.csv"
				file8 =  "SynapseAssets/wp_term_relationships.csv"
				file9 =  "SynapseAssets/wp_term_taxonomy.csv"
				file10 = "SynapseAssets/wp_terms.csv"
				file11 = "SynapseAssets/wp_textbook_relationships.csv"
				file12 = "SynapseAssets/wp_usermeta.csv"
				file13 = "SynapseAssets/wp_users.csv"

				# console.log file
				@sendParsedData1 file ,filePath
				


		
		readAsText : (file)->
			console.log "hiee1"+file
			reader = new FileReader()
			reader.onloadend = (evt)=>
				alert "in"
				# console.log  "result" +evt.target.result
				# csvString = evt.target.result
				# console.log  "csvString" +csvString
				parsedData = $.parse(csvString, {
					header : false
					dynamicTyping : false
					})
				console.log "result is "+parsedData.results
			reader.readAsText file

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
					# @readValues
				)
				# @sendParsedData2 file1 ,fileEntry



		sendParsedData2 : (file1, fileEntry)=>
			fileEntry=fileEntry
			readData = @chkReader(file1)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData15 : (file14, fileEntry)=>
			fileEntry=fileEntry
			readData = @chkReader(file14)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)

		sendParsedData3 : (file2, fileEntry)=>
			readData = @chkReader(file2)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData4 : (file3, fileEntry)=>
			readData = @chkReader(file3)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)

		
		sendParsedData5 : (file4, fileEntry)=>
			readData = @chkReader(file4)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)

		sendParsedData6 : (file5, fileEntry)=>
			readData = @chkReader(file5)
			readData.done (data)=>
				# console.log "parsed data"+data
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

					# @readValues
				)
		sendParsedData7 : (file6, fileEntry)=>
			readData = @chkReader(file6)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)

		sendParsedData8 : (file7, fileEntry)=>
			readData = @chkReader(file7)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)

		sendParsedData9 : (file8, fileEntry)=>
			readData = @chkReader(file8)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData10 : (file9, fileEntry)=>
			readData = @chkReader(file9)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData11 : (file10, fileEntry)=>
			readData = @chkReader(file10)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData12 : (file11, fileEntry)=>
			readData = @chkReader(file11)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData13 : (file12, fileEntry)=>
			readData = @chkReader(file12)
			readData.done (data)=>
				# console.log "parsed data"+data
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
					# @readValues
				)
		sendParsedData14 : (file13, fileEntry)=>
			readData = @chkReader(file13)
			readData.done (data)=>
				# console.log "parsed data"+data
				_.db.transaction( (tx)=>

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename,user_email,user_url,user_registered,user_activation_key, user_status,display_name, spam,deleted) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][1], data[i][2], data[i][3], data[i][4], data[i][5],data[i][6], data[i][7], data[i][8], data[i][9], data[i][10],data[i][11], data[i][12]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully14'
					App.execute "close:sync:view"
					_.setInitialSyncFlag('sync')
					# @readValues
				)


#this functio will read the unzipped data
		# readAsTextData : (file)->
		# 	console.log "read files" +file.toURL()
		# 	reader = new FileReader()
		# 	reader.onloadend = (evt)->
		# 		alert "result" +evt.target.result
		# 		alert "csvString" +csvString
		# 		csvString = evt.target.result
		# 		parsedData = $.parse(csvString, {
		# 			header : false
		# 			dynamicTyping : false
		# 			})
		# 		console.log "result is "+parsedData.results

		# 	reader.readAsText file
			# fileUnZip : (url, filename)->
			# 	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
					
			# 		, (fs)=>
			# 			zipPath = filename
			# 			fileTransfer = new FileTransfer();
			# 			fileTransfer.download(url, zipPath
							
			# 				,((entry)=>
			# 					# alert "load"+entry.fullPath
			# 					console.log entry.toURL()+"  Hello!";
			# 					fullpath = entry.toURL()
			# 					loader = new ZipLoader(fullpath)
			# 					$.each loader.getEntries(fullpath)

			# 					, (i, entry)=>
			# 						console.log "Name: " + entry.name() + " Size: " + entry.size() + " is Directory: " + entry.isDirectory()
			# 						@readAsTextData entry)
			# 				, _.fileTransferErrorHandler)
					
			# 		, _.fileErrorHandler)

			# dwnl : (url, filename)->
			# 	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
					
			# 		, (fs)=>
			# 			zipPath = filename
			# 			fileTransfer = new FileTransfer();
			# 			fileTransfer.download(url, zipPath
							
			# 				,(entry)=>
			# 					# alert "load"+entry.fullPath
			# 					console.log entry.toURL()+"  Hello!";
			# 					fullpath = entry.toURL()
			# 					# reader = new FileReader()
			# 					# reader.onloadend = (evt)->
			# 					# 	alert "result" +evt.target.result
			# 					# reader.readAsText file
			# 					@fileUnZip fullpath
			# 				, _.fileTransferErrorHandler)
					
			# 		, _.fileErrorHandler)
			


#This Function Will upload the zip file to the server

		fileUpload: (fileEntry)->
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
				, (r)->
					console.log "Code = " + r.responseCode
					console.log "Response = " + r.response
					console.log "Sent = " + r.bytesSent

				, (error)->
					alert "An error has occurred: Code = " + error.code
					console.log "upload error source " + error.source
					console.log "upload error target " + error.target

				, options)

#this Function Will download from server the updated records for the 3 tables
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
								@downlaodFiles files[i], fileEntry

						, _.fileErrorHandler)

				, _.fileSystemErrorHandler)

	
		downlaodFiles : (files , fileEntry)->
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

		# readAsText : (file)->
		# 	reader = new FileReader()
		# 	reader.onloadend = (evt)->
		# 		alert "result" +evt.target.result
		# 		alert "csvString" +csvString
		# 		csvString = evt.target.result
		# 		parsedData = $.parse(csvString, {
		# 			header : false
		# 			dynamicTyping : false
		# 			})
		# 		console.log "result is "+parsedData.results
		# 		@sendParsedData parsedData.results

		# 	reader.readAsText file

#This function Inserts the data in the Database

		sendParsedData : (data)->

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
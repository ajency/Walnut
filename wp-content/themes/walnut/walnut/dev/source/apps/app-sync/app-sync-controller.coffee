define ["marionette","app", "underscore", "csvparse" ], (Marionette, App, _, parse) ->

	class SynchronizationController extends Marionette.Controller

		
		getDownloadURL:->
			$('#syncSuccess')
			.css("display","block")
			.text("Starting file download...")

			# lastDownloadTimestamp = _.getLastDownloadTimeStamp()
			# lastDownloadTimestamp.done (time_stamp)=>

			data = 
				blog_id: _.getBlogID()
				last_sync: ''#time_stamp

			#TODO: Change action name for import
			$.get AJAXURL + '?action=sync-database',
					data,
				   (resp)=>
				   		console.log 'RESP'
				   		console.log resp

				   		@dwnldUnZip resp
							
					,
					'json'


		# Download the zip file from the server and extract its contents
		dwnldUnZip : (resp) ->

			$('#syncSuccess')
			.css("display","block")
			.text("Downloading file...")

			uri = encodeURI(resp.exported_csv_url)

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0

				, (fileSystem)=>

					fileSystem.root.getFile("SynapseAssets/file.zip", {create: true, exclusive: false}

						,(fileEntry)=>
							filePath = fileEntry.toURL().replace("file.zip", "")
							_.setFilePath(filePath)
							fileEntry.remove()
							fileTransfer = new FileTransfer()

							fileTransfer.download(uri, filePath+"csv-synapse.zip" 
								,(file)=>
									console.log 'Zip file downloaded'

									_.updateSyncDetails('file_download', resp.last_sync)
									
									@fileUnZip filePath, file.toURL()
								
								,(error)->
									$('#syncSuccess').css("display","none")

									$('#syncStartContinue').css("display","block")
									$('#syncButtonText').text('Try again')

									$('#syncError').css("display","block")
									.text("An error occurred during file download")

								, true)

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

												do(parsedData)->

													for i in [0..parsedData.results.length-1] by 1

														for j in [0..parsedData.results[i].length-1] by 1
															parsedData.results[i][j] = parsedData.results[i][j].replace(/\\/g,'"')

												d.resolve parsedData.results

											reader.readAsText file

										, _.fileErrorHandler)
								, _.fileErrorHandler)
						, _.fileSystemErrorHandler)

			$.when(read()).done ->
				console.log 'read done'
			.fail _.failureHandler			

		
		fileUnZip : (filePath, fullpath)->

			$('#syncSuccess').css("display","block")
			.text("File download completed")

			success =()=>
				console.log 'Files unzipped successfully'
				
				setTimeout(=>
					@readUnzipFile1()
					
				,3000)


			zip.unzip(fullpath, filePath, success)


		readUnzipFile1 : ->
			$('#syncSuccess').css("display","block")
			.text("Starting file import...")

			filePath = _.getFilePath()
			file = "SynapseAssets/"+_.getTblPrefix()+"class_divisions.csv"

			setTimeout(=>
				@sendParsedData1 file ,filePath
				
			,3000)


		
		#13 insert functions
		sendParsedData1 : (file, fileEntry)=>
			$('#syncSuccess')
			.css("display","block")
			.text("Importing file...")

			fileEntry = fileEntry
			readData = @chkReader(file)
			readData.done (data)=>

				_.db.transaction((tx)=>
					tx.executeSql("DELETE FROM "+_.getTblPrefix()+"class_divisions")
					
					for i in [0..data.length-1] by 1
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"class_divisions 
							(id, division, class_id) VALUES (?, ?, ?)"
								, [data[i][0], data[i][1], data[i][2]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully1'
					file1 =  "SynapseAssets/"+_.getTblPrefix()+"question_response.csv"
					@sendParsedData2 file1 ,fileEntry
				)


		sendParsedData2 : (file1, fileEntry)=>
			fileEntry = fileEntry
			readData = @chkReader(file1)
			readData.done (data)=>

				_.db.transaction( (tx)=>
					tx.executeSql("DELETE FROM "+_.getTblPrefix()+"question_response")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO "+_.getTblPrefix()+"question_response 
							(ref_id, teacher_id, content_piece_id, collection_id, division 
							,question_response ,time_taken ,start_date ,end_date ,status ,sync) 
							VALUES (?,?,?,?,?,?,?,?,?,?,?)"
							, [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4]
							, data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], 1])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully2'
					file3 =  "SynapseAssets/wp_collection_meta.csv"
					@sendParsedData4 file3 ,fileEntry

				)
		
		sendParsedData4 : (file3, fileEntry)=>
			readData = @chkReader(file3)
			readData.done (data)=>

				_.db.transaction( (tx)=>
					tx.executeSql("DELETE FROM wp_collection_meta")
					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_collection_meta (id, collection_id, meta_key, meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

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
					tx.executeSql("DELETE FROM wp_content_collection")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_content_collection (id, name, created_on, created_by, last_modified_on,last_modified_by,published_on,published_by, status,type, term_ids, duration) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]])

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
					tx.executeSql("DELETE FROM wp_options")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_options (option_id, option_name, option_value, autoload) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully6'
					file6 =  "SynapseAssets/wp_postmeta.csv"
					@sendParsedData7 file6 ,fileEntry


				)
		sendParsedData7 : (file6, fileEntry)=>
			readData = @chkReader(file6)
			readData.done (data)=>

				_.db.transaction((tx)=>
					tx.executeSql("DELETE FROM wp_postmeta")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_postmeta (meta_id, post_id, meta_key, meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

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
					tx.executeSql("DELETE FROM wp_posts")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_posts (ID,post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9],data[i][10], data[i][11], data[i][12], data[i][13], data[i][14],data[i][15], data[i][16], data[i][17], data[i][18], data[i][19],data[i][20], data[i][21], data[i][22]])

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
					tx.executeSql("DELETE FROM wp_term_relationships")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_term_relationships (object_id,term_taxonomy_id, term_order) 
						VALUES (?, ?, ?)", [data[i][0], data[i][1], data[i][2]])

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
					tx.executeSql("DELETE FROM wp_term_taxonomy")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy, description, parent, count) 
							VALUES (?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]])

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
					tx.executeSql("DELETE FROM wp_terms")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

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
					tx.executeSql("DELETE FROM wp_textbook_relationships")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_textbook_relationships (id, textbook_id, class_id, tags) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

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
					tx.executeSql("DELETE FROM wp_usermeta")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) 
							VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully13'
					file13 = "SynapseAssets/wp_users.csv"
					@sendParsedData14 file13 ,fileEntry

				)
		
		sendParsedData14 : (file13, fileEntry)=>
			readData = @chkReader(file13)
			readData.done (data)=>
				console.log 'wp_users data'
				console.log data

				_.db.transaction( (tx)=>
					tx.executeSql("DELETE FROM wp_users")

					for i in [0..data.length-1] by 1
						row = data[i]
						tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename,user_email,user_url,user_registered,user_activation_key, user_status,display_name, spam,deleted) 
							VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4],data[i][5], data[i][6], data[i][7], data[i][8], data[i][9],data[i][10], data[i][11]])

				,_.transactionErrorhandler
				,(tx)=>
					console.log 'Data inserted successfully14'

					_.updateSyncDetails('file_import', _.getCurrentDateTime(2))

					$('#syncSuccess')
					.css("display","block")
					.text("File import completed")

					setTimeout(=>

						$('#syncSuccess')
						.css("display","block")
						.text("Sync completed successfully")

						App.execute "show:leftnavapp", region:App.leftNavRegion	
					
					,2000)
					

					setTimeout(=>

						App.navigate('teachers/dashboard', trigger: true)
					
					,3000)
				)

		





	# request handler
	App.reqres.setHandler "get:sync:controller", ->
		new SynchronizationController
define ['underscore'], ( _) ->

	#File download

	_.mixin

		getZipFileDownloadDetails : ->

			$('#syncSuccess').css("display","block").text("Starting file download...")

			userDetails = _.getUserDetails(_.getUserID())
			userDetails.done (userDetails)->
				blog_id = userDetails.blog_id

				lastDownloadTimestamp = _.getLastDownloadTimeStamp()
				lastDownloadTimestamp.done (time_stamp)->

					textbookIdsByClassID = _.getTextbookIdsByClassID()
					textbookIdsByClassID.done (textbook_ids)->

						data = blog_id: blog_id, last_sync: time_stamp
							, textbook_ids: textbook_ids, user_id: _.getUserID()
							, sync_type : "student_app"

						console.log JSON.stringify data

						#TODO: Change action name for import.
						$.get AJAXURL + '?action=sync-database',
								data,
								(resp)=>
									console.log 'getZipFileDownloadDetails response'
									console.log JSON.stringify resp
									alert "data"
									_.downloadZipFile resp

								,
								'json'

						.fail ->
							_.onDataSyncError("none", "Could not connect to server")


		
		downloadZipFile : (resp)->

			$('#syncSuccess').css("display","block").text("Downloading file...")
			uri = encodeURI resp.exported_csv_url

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
				,(fileSystem)=>
					fileSystem.root.getFile("SynapseAssets/SynapseData/csv-synapse.zip"
						, {create: true, exclusive: false}

						,(fileEntry)->
							filePath = fileEntry.toURL().replace("csv-synapse.zip", "")

							fileEntry.remove()

							fileTransfer = new FileTransfer()
							
							fileTransfer.download(uri, filePath+"csv-synapse.zip" 
								,(file)->
									_.onFileDownloadSuccess(file.toURL(), filePath, resp.last_sync)
								
								,(error)->
									_.onDataSyncError(error, "An error occurred during file download")

								, true)

						,_.fileErrorHandler)

				, _.fileSystemErrorHandler)


		
		onFileDownloadSuccess : (source, destination, last_sync)->

			console.log 'Downloaded Zip file successfully'
			console.log JSON.stringify source
			console.log JSON.stringify destination
			

			# Unzip downloaded file
			onFileUnzipSuccess = ->

				console.log 'Files unzipped successfully'

				_.updateSyncDetails('file_download', last_sync)
				
				$('#syncSuccess').css("display","block").text("File download completed")
				
				# setTimeout(=>
					# _.startFileImport()
				# ,2000)
				setTimeout(=>
				    App.navigate('students/dashboard', trigger: true)
				,2000)
				
			zip.unzip(source, destination, onFileUnzipSuccess)
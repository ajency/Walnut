define ['underscore'], ( _) ->

	#File download

	_.mixin

		getZipFileDownloadDetails : ->

			$('#syncSuccess').css("display","block").text("Starting file download...")

			lastDownloadTimestamp = _.getLastDownloadTimeStamp()
			lastDownloadTimestamp.done (time_stamp)->

				data = blog_id: _.getBlogID(), last_sync: time_stamp

				#TODO: Change action name for import.
				$.get AJAXURL + '?action=sync-database',
						data,
						(resp)=>
							console.log 'getZipFileDownloadDetails response'
							console.log resp

							_.downloadZipFile resp

						,
						'json'

				.fail ->
					_.onDataSyncError("none", "Could not connect to server")


		
		downloadZipFile : (resp)->

			$('#syncSuccess').css("display","block").text("Downloading file...")

			uri = encodeURI resp.exported_csv_url

			value = _.getStorageOption()
			option = JSON.parse(value)
			if option.internal
				filepath = option.internal
			else if option.external
				filepath = option.external
			
			window.resolveLocalFileSystemURL('file://'+filepath+''
				,(fileSystem)->

					fileSystem.getFile("SynapseAssets/SynapseData/csv-synapse.zip"
						, {create: true, exclusive:false} 
						
						,(fileEntry)->
							csvFilePath = fileEntry.toURL().replace("csv-synapse.zip", "")

							fileEntry.remove()

							fileTransfer = new FileTransfer()
							
							fileTransfer.download(uri, csvFilePath+"csv-synapse.zip" 
								,(file)->
									_.onFileDownloadSuccess(file.toURL(), csvFilePath, resp.last_sync)
								
								,(error)->
									_.onDataSyncError(error, "An error occurred during file download")

								, true)

						,_.fileErrorHandler)

				, _.fileSystemErrorHandler)


		
		onFileDownloadSuccess : (source, destination, last_sync)->

			console.log 'Downloaded Zip file successfully'

			# Unzip downloaded file
			onFileUnzipSuccess = ->

				console.log 'Files unzipped successfully'

				_.updateSyncDetails('file_download', last_sync)
				
				$('#syncSuccess').css("display","block").text("File download completed")
				
				setTimeout(=>
					_.startFileImport()
				,2000)
				
			zip.unzip(source, destination, onFileUnzipSuccess)
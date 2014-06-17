define ['underscore'], ( _) ->

	#File download

	_.mixin

		getZipFileDownloadDetails : ->

			$('#syncSuccess').css("display","block").text("Starting file download...")

			# lastDownloadTimestamp = _.getLastDownloadTimeStamp()
			# lastDownloadTimestamp.done (time_stamp)->

			data = blog_id: _.getBlogID(), last_sync: ''#time_stamp

			#TODO: Change action name for import.
			$.get AJAXURL + '?action=sync-database',
					data,
					(resp)=>
						console.log 'getZipFileDownloadDetails response'
						console.log resp

						_.downloadZipFile resp

					,
					'json'


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
									_.onFileDownloadSuccess file.toURL() filePath resp.last_sync
								
								,(error)->
									_.onFileDownloadError error

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
				
			zip.unzip source destination onFileUnzipSuccess
			


		onFileDownloadError : (error)->

			console.log 'ERROR: '+error.code

			$('#syncSuccess').css("display","none")

			$('#syncStartContinue').css("display","block")

			$('#syncButtonText').text('Try again')

			$('#syncError').css("display","block")
			.text("An error occurred during file download")
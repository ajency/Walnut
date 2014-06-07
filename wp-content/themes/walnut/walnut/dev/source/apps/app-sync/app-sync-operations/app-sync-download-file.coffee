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
							console.log 'File download details response'
							console.log resp

							_.downloadZipFile resp

						,
						'json'


		downloadZipFile : (resp)->

			$('#syncSuccess').css("display","block").text("Downloading file...")

			uri = encodeURI(resp.exported_csv_url)

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
				,(fileSystem)=>
					fileSystem.root.getFile("SynapseAssets/file.zip", {create: true, exclusive: false}

						,(fileEntry)=>
							filePath = fileEntry.toURL().replace("file.zip", "")
							_.setFilePath(filePath)
							fileEntry.remove()
							fileTransfer = new FileTransfer()

							fileTransfer.download(uri, filePath+"csv-synapse.zip" 
								,(file)=>
									console.log 'Zip file downloaded'

									@updateSyncDetails('file_download', resp.last_sync)
									
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






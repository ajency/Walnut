define ['underscore', 'jquery'], ( _ , $) ->


	_.mixin


		startMediaSync : ->

			_.syncFiles 'Image'



		syncFiles : (file_type)->

			localFileList = _.getListOfFilesFromLocalDirectory file_type
			localFileList.done (localFilesList)->

				remoteFileList = _.getListOfMediaFilesFromServer file_type
				remoteFileList.done (remoteFilesList)->

					fileTobeDownloaded = _.getFilesToBeDownloaded(localFilesList, remoteFilesList)
					fileTobeDownloaded.done (files_to_be_downloaded)->

						if files_to_be_downloaded.length > 0
							
							_.downloadMediaFiles(files_to_be_downloaded, 0, file_type)

						else
							_.syncFiles 'Audio' if file_type is 'Image'
							_.syncFiles 'Video' if file_type is 'Audio'

							if file_type is 'Video'

								$('#syncMediaSuccess').css("display","block").text("All media files updated")

								setTimeout(=>
									App.navigate('students/dashboard', trigger: true)
								,2000)



		downloadMediaFiles : (filesTobeDownloaded, index, file_type)->

			availableMemory = _.getAvailableDeviceStorageSize()
			availableMemory.done (deviceSize)->

				fileSize = filesTobeDownloaded[index].size

				if(deviceSize < fileSize)
					_.onMediaSyncError('none', "Can't download file. There is not enough free space on the device")
				
				else
					file = filesTobeDownloaded[index].link		 
					directoryPath = file.substr(file.indexOf("uploads/"))
					fileName = file.substr(file.lastIndexOf('/') + 1)

					esc = $('<div>').text("Downloading "+file_type.toLowerCase()+" files...\n\n"+fileName).text()
					$('#syncMediaSuccess').css("display","block").html(esc.replace(/\n/g, '<br />'))

					uri = encodeURI file
					localPath = _.getSynapseMediaDirectoryPath() + directoryPath

					# directoryStructure = _.createDirectoryStructure directoryPath
					# directoryStructure.done ->

					fileTransfer = new FileTransfer()

						# fileTransfer.onprogress = (progressEvent)->
						# 	if progressEvent.lengthComputable
						# 		percentage = Math.floor(progressEvent.loaded / progressEvent.total * 100)
						# 		$('#mediaProgressUpdate').css("width",""+percentage+"%")
						# 	else
						# 		$('#mediaProgressUpdate').css("width","100%")


					fileTransfer.download(uri, localPath 
						,(file)->
							if index < filesTobeDownloaded.length-1
								_.downloadMediaFiles(filesTobeDownloaded, (index + 1), file_type)

							else
								_.syncFiles 'Audio' if file_type is 'Image'

								_.syncFiles 'Video' if file_type is 'Audio'

								if file_type is 'Video'
									$('#syncMediaSuccess').css("display","block").text("Media sync completed")

									setTimeout(=>
										App.navigate('students/dashboard', trigger: true)
									,2000)


						,(error)->
							_.onMediaSyncError(error, "An error occurred during file download")

						, true)



		
		getListOfFilesFromLocalDirectory : (file_type)->

			path = file_type.toLowerCase()+"s"

			runFunc = ->
				$.Deferred (d)->

					localFilesList = []

					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
						, (fileSystem)->
							fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/"+path
								, {create: false, exclusive: false}

								, (directoryEntry)->
									reader = directoryEntry.createReader()
									reader.readEntries ((entries)->
										for i in [0..entries.length-1] by 1
											localFilesList[i] = entries[i].name

										d.resolve localFilesList
									)
								
								, (error)->
									d.resolve localFilesList
								)

						, _.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'getListOfFilesFromLocalDirectory done'
			.fail _.failureHandler
				

		
		getListOfMediaFilesFromServer : (file_type)->

			runFunc = ->
				$.Deferred (d)->

					action = "get-site-"+file_type.toLowerCase()+"-resources-data"
					
					data = ''
					$.get AJAXURL + '?action='+action,
						data,
						(resp)=>
							console.log 'Download details response for '+file_type
							console.log resp

							d.resolve resp
						,
						'json'

					.fail ->
						_.onMediaSyncError("none", "Could not connect to server")


			$.when(runFunc()).done ->
				console.log 'getListOfMediaFilesFromServer done'
			.fail _.failureHandler



		getFilesToBeDownloaded :(localEntries, serverEntries) ->

			runFunc = ->
				$.Deferred (d)->

					if localEntries.length is 0
						d.resolve serverEntries

					else
						filesTobeDownloaded = []

						_.each serverEntries, (serverFile, i)->
							fileName = serverFile.link.substr(serverFile.link.lastIndexOf('/') + 1)
							
							if localEntries.indexOf(fileName) == -1
								filesTobeDownloaded.push serverFile

						d.resolve filesTobeDownloaded

			$.when(runFunc()).done ->
				console.log 'getFilesToBeDownloaded done'
			.fail _.failureHandler
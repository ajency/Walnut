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

							$('#syncMediaSuccess').css("display","block")
							.text("Downloading "+file_type+" files...")

							downloadFiles = _.downloadMediaFiles(files_to_be_downloaded, 0, file_type)

						else
							$('#syncMediaSuccess').css("display","block")
							.text(file_type+" files already upto date")

							_.syncFiles 'Audio' if file_type is 'Image'

							_.syncFiles 'Video' if file_type is 'Audio'

							if file_type is 'Video'
								setTimeout(=>
									App.navigate('teachers/dashboard', trigger: true)
								,2000)



		downloadMediaFiles : (filesTobeDownloaded, index, file_type)->

			# $('#syncMediaProgress').css("display","none")
			
			file = filesTobeDownloaded[index]		 
			directoryPath = file.substr(file.indexOf("uploads/"))
			fileName = file.substr(file.lastIndexOf('/') + 1)
			
			#audio path from server has media-web/audio-web , here we replace it with audios
			if file_type is 'Audio'
				directoryPath = directoryPath.replace("media-web/audio-web", "audios")
			
			escaped = $('<div>').text("Downloading...\n\n"+fileName).text()
			$('#syncMediaSuccess').css("display","block").html(escaped.replace(/\n/g, '<br />'))

			# $('#syncMediaProgress').css("display","block")
			# $('#mediaProgressUpdate').css("width","0%")

			uri = encodeURI file
			localPath = _.getSynapseMediaDirectoryPath() + directoryPath

			directoryStructure = _.createDirectoryStructure directoryPath
			directoryStructure.done ->

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
							$('#syncMediaSuccess').css("display","block")
							.text("Downloaded all "+file_type+" files")

							_.syncFiles 'Audio' if file_type is 'Image'

							_.syncFiles 'Video' if file_type is 'Audio'

							if file_type is 'Video'
								setTimeout(=>
									App.navigate('teachers/dashboard', trigger: true)
								,2000)


					,(error)->
						console.log 'ERROR: '+error.code
						$('#syncMediaSuccess').css("display","none")

						$('#syncMediaStart').css("display","block")

						$('syncMediaButtonText').text('Try again')

						$('syncMediaError').css("display","block")
						.text('An error occurred during file download')

					, true)

				


		
		getListOfFilesFromLocalDirectory : (file_type)->

			path = 'images' if file_type is 'Image'
			path = 'audios' if file_type is 'Audio'
			path = 'videos' if file_type is 'Video'

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

					if file_type is 'Image'
						action = 'get-site-image-resources-data'
					if file_type is 'Audio'
						action = 'get-site-audio-resources-data'
					if file_type is 'Video'
						action = 'get-site-video-resources-data'

					
					data = ''
					$.get AJAXURL + '?action='+action,
						data,
						(resp)=>
							console.log 'Download details response for '+file_type
							console.log resp

							d.resolve resp
						,
						'json'


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
							fileName = serverFile.substr(serverFile.lastIndexOf('/') + 1)
							
							if localEntries.indexOf(fileName) == -1
								filesTobeDownloaded.push serverFile

						d.resolve filesTobeDownloaded

			$.when(runFunc()).done ->
				console.log 'getFilesToBeDownloaded done'
			.fail _.failureHandler
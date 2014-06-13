define ['underscore','jquery'], ( _ , $) ->


	_.mixin

		downloadMediaFiles : ->

			$('#syncMediaSuccess').css("display","block").text("Contacting server...")

			localFiles = _.getListOfMediaFilesFromLocalDirectory()
			localFiles.done (local_entries)->

				console.log 'local_entries'
				console.log local_entries
				
				filesOnServer = _.getListOfMediaFilesFromServer()
				filesOnServer.done (files_on_server)->
				
					filesToBeDownloaded = _.compareFiles(local_entries, files_on_server)
					filesToBeDownloaded.done (files_to_be_downloaded)->

						$('#syncMediaSuccess').css("display","block").text("Downloading files...")

						_.each files_to_be_downloaded, (file, i)->

							directoryPath = file.substr(file.indexOf("uploads/"))

							fileName = file.substr(file.lastIndexOf('/') + 1)

							uri = encodeURI file

							localPath = _.getSynapseImagesDirectoryPath() + directoryPath
						
							directoryStructure = _.createDirectoryStructure directoryPath
							directoryStructure.done ->

								fileTransfer = new FileTransfer()
								fileTransfer.download(uri, localPath 
									,(file)->
										$('#syncMediaSuccess').css("display","block")
										.text("Downloaded file "+fileName)

									,(error)->
										$('#syncMediaSuccess').css("display","none")
										
										$('#syncMediaError').css("display","block")
										.text("An error occurred during file download.")


									, true)


		
		compareFiles :(localEntries, serverEntries) ->

			runFunc = ->
				$.Deferred (d)->

					if localEntries.length is 0
						d.resolve serverEntries.fileImg

					else
						filesTobeDownloaded = []

						_.each serverEntries.fileImg, (serverFile, i)->
							fileName = serverFile[i].substr(serverFile[i].lastIndexOf('/') + 1)
							if localEntries.indexOf(fileName) == -1
								filesTobeDownloaded.push serverFile[i]

						d.resolve filesTobeDownloaded


			$.when(runFunc()).done ->
				console.log 'compareFiles done'
			.fail _.failureHandler


		
		getListOfMediaFilesFromLocalDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					fullDirectoryEntry = []

					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
						, (fileSystem)->
							fileSystem.root.getDirectory("SynapseAssets/SynapseImages"
								, {create: false, exclusive: false}

								, (directoryEnrty)->
									
									reader = directoryEnrty.createReader()
									reader.readEntries ((directoryEnrty)->
										for i in [0..directoryEnrty.length-1] by 1
											fullDirectoryEntry[i] = directoryEnrty[i].name

										d.resolve fullDirectoryEntry

									)
								, (error)->
									d.resolve error
								)

						, _.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'Got list of all files present in the local directory'
			.fail _.failureHandler
		
				

		getListOfMediaFilesFromServer:->

			runFunc = ->
				$.Deferred (d)->
					listOfFiles = []
					listOfFiles = 
						fileImg : [ "http://synapsedu.info/wp-content/uploads/videos/oceans-clip.mp4"
									"http://synapsedu.info/wp-content/uploads/2014/05/tux.png"
									"http://synapsedu.info/wp-content/uploads/2014/05/Vertical-large.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/05/imag56es.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/05/girl1.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/05/tom_jerry.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/05/cover_pic1.png"
									"http://synapsedu.info/wp-content/uploads/2014/06/Tulips.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/06/Jellyfish.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/06/Koala.jpg"
									"http://synapsedu.info/wp-content/uploads/2014/06/Lighthouse.jpg"]
				
					d.resolve listOfFiles

			$.when(runFunc()).done ->
				console.log 'getListOfMediaFilesFromServer done'
			.fail _.failureHandler
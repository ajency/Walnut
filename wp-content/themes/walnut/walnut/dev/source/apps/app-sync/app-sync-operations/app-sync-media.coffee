define ['underscore','jquery'], ( _ , $) ->


	_.mixin

		downloadMediaFiles : ->

			$('#syncMediaSuccess').css("display","block").text("Contacting server...")

			localFiles = _.getListOfMediaFilesFromLocalDirectory()
			localFiles.done (local_entries)->
				
				filesOnServer = _.getListOfMediaFilesFromServer()
				
				filesToBeDownloaded = _.compareFiles(local_entries, filesOnServer)

				_.each filesToBeDownloaded, (file, i)->

					directoryPath = file.substr(file.indexOf("uploads/"))
				
					directoryStructure = _.createDirectoryStructure(directoryPath)
					directoryStructure.done ->
						console.log 'Directory successfully created'

					# ft = new FileTransfer()
					# ft.download(uri, filePath 
					# 	,(file)->
					# 		$('#syncMediaSuccess').css("display","block").text("files to be downloaded are ")

					# 	,_.fileTransferErrorHandler, true)


		
		compareFiles :(localEntries, serverEntries) ->

			filesTobeDownloaded = []

			_.each serverEntries.fileImg, (serverFile, i)->
				fileName = serverFile[i].substr(serverFile[i].lastIndexOf('/') + 1)
				if localEntries.indexOf(fileName) == -1
					filesTobeDownloaded.push serverFile[i]

			filesTobeDownloaded


		
		getListOfMediaFilesFromLocalDirectory : ->

			listOfPresentFilesInDirectory = ->
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
											console.log directoryEnrty[i].name+' dir? '+directoryEnrty[i].isDirectory
											console.log "your path is "+directoryEnrty[i].toURL()
											fullDirectoryEntry[i] = directoryEnrty[i].name
										console.log "value is "+fullDirectoryEntry
										d.resolve fullDirectoryEntry

									)
								, (error)->
									d.resolve error
								)

						, _.fileSystemErrorHandler)

			$.when(listOfPresentFilesInDirectory()).done ->
				console.log 'Got list of all files present in the directory'
			.fail _.failureHandler
		
				

		getListOfMediaFilesFromServer:->
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
				
			listOfFiles
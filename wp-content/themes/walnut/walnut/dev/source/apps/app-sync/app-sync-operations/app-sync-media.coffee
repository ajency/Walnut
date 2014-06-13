define ['underscore','jquery'], ( _ , $) ->


	_.mixin


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
				console.log 'List of all files present in the directory'
			.fail _.failureHandler



		chkDeferred : ->
			directoryEntriesPresent = _.getListOfMediaFilesFromLocalDirectory()
			directoryEntriesPresent.done (local_entries)->
				if _.isArray local_entries
					console.log "entries"+local_entries
					# entries = JSON.stringify local_entries
					# console.log "the local entries are"+entries
				else
					console.log "Error reading the directory entries array"
				

		getListOfMediaFilesFromServer:->
			alert "list of files"
			listOfFiles = []
			listOfFiles = 
				fileImg : ["1_2.jpg", 
				"1_2_2.jpg",
				"1_2_3.jpg",
				"1_2_4.jpg",
				"1_2_5.jpg",
				"1_2_6.jpg",
				"1_2_7.jpg",
				"1_2_8.jpg",
				"1_2_9.jpg",
				"1_2_10.jpg",
				"1_2_11.jpg",
				"1_3.jpg",
				"1_3_2.jpg",
				"1_3_3.jpg",
				"1_3_4.jpg",
				"1_3_5.jpg",
				"1_90.jpg",
				"1_90_2.jpg",
				"1_90_3.jpg"]
				
			listOfFiles


		compareFiles :(localEntries, serverEntries) ->
			alert "last"
			checkingTheFiles = ->
				$.Deferred (d)->
					filesTobeDownloaded = []
					alert "image"+serverEntries.fileImg.length
					for i in [0..serverEntries.fileImg.length-1] by 1
						if localEntries.indexOf(serverEntries.fileImg[i]) == -1
							filesTobeDownloaded.push serverEntries.fileImg[i]
					
					console.log "files needed to be dwnlded"+filesTobeDownloaded.length
					d.resolve filesTobeDownloaded

			$.when(checkingTheFiles()).done ->
				console.log 'List of files which need to be downloaded'
			.fail _.failureHandler


		downloadMediaFiles : ->

			$('#syncMediaSuccess').css("display","block").text("Contacting server...")


			localFiles = _.getListOfMediaFilesFromLocalDirectory()
			localFiles.done (local_entries)->
				
				filesOnServer = _.getListOfMediaFilesFromServer()
				console.log "server list"+filesOnServer
				
				filesToBeDownloaded = _.compareFiles(local_entries, filesOnServer)
				filesToBeDownloaded.done (filesTobeDownloaded)->
					alert "needed to be downloaded are "+filesTobeDownloaded
					
					console.log "needed to be downloaded are "+filesTobeDownloaded

					# ft = new FileTransfer()
					# ft.download(uri, filePath 
					# 	,(file)->
					# 		$('#syncMediaSuccess').css("display","block").text("files to be downloaded are ")

					# 	,_.fileTransferErrorHandler, true)



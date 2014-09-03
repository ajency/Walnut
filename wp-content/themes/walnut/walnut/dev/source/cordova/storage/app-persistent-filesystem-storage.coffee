define ['underscore'], ( _) ->


	_.mixin

		#set 'SynapseMedia' directory path to local storage
		setSynapseMediaDirectoryPathToLocalStorage : ->
			
			synapseMediaDirectory = _.createSynapseMediaDirectory()
			synapseMediaDirectory.done ->
			
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
					,(fileSystem)->
						fileSystem.root.getDirectory("SynapseAssets/SynapseMedia"
							,{create: false, exclusive:false} 
							
							,(fileEntry)->
								console.log 'SynapseMedia directory path: '+fileEntry.toURL()#+'/'
								_.setSynapseMediaDirectoryPath fileEntry.toURL()#+'/'
							
							,(error)->
								console.log 'ERROR: '+error.code
							)

					,_.fileSystemErrorHandler)

			


		#Create 'SynapseAssets' directory
		createSynapseAssetsDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
						,(fileSystem)->
							fileSystem.root.getDirectory("SynapseAssets",{create: true, exclusive:false} 
								
								,(fileEntry)->
									console.log 'SynapseAssets directory path: '+fileEntry.toURL()
									d.resolve fileEntry
								
								,(error)->
									console.log 'ERROR: '+error.code
								)

						,_.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'createSynapseAssetsDirectory done'
			.fail _.failureHandler


		
		#Create 'SynapseMedia' directory inside 'SynapseAssets'
		createSynapseMediaDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					synapseAssetsDirectory = _.createSynapseAssetsDirectory()
					synapseAssetsDirectory.done ->

						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
							,(fileSystem)->
								fileSystem.root.getDirectory("SynapseAssets/SynapseMedia"
									,{create: true, exclusive:false} 
									
									,(fileEntry)->
										console.log 'SynapseMedia directory path: '+fileEntry.toURL()
										d.resolve fileEntry
									
									,(error)->
										console.log 'ERROR: '+error.code
									)

							,_.fileSystemErrorHandler)


			$.when(runFunc()).done ->
				console.log 'createSynapseMediaDirectory done'
			.fail _.failureHandler



		#Create 'SynapseData' directory inside 'SynapseAssets' for file sync operations
		createSynapseDataDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					synapseAssetsDirectory = _.createSynapseAssetsDirectory()
					synapseAssetsDirectory.done ->

						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
							,(fileSystem)->
								fileSystem.root.getDirectory("SynapseAssets/SynapseData"
									,{create: true, exclusive:false} 
									
									,(fileEntry)->
										console.log 'SynapseData directory path: '+fileEntry.toURL()
										d.resolve fileEntry
									
									,(error)->
										console.log 'ERROR: '+error.code
									)

							,_.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'createSynapseDataDirectory done'
			.fail _.failureHandler


		
		#Create 'videos-web' directory inside 'uploads' for saving decrypted files
		createVideosWebDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
						,(fileSystem)->
							fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/videos-web"
								,{create: true, exclusive:false} 
								
								,(fileEntry)->
									console.log 'videos-web directory path: '+fileEntry.toURL()
									d.resolve fileEntry
								
								,(error)->
									console.log 'ERROR: '+error.code
								)

						,_.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'createVideosWebDirectory done'
			.fail _.failureHandler

		
		#Create 'audios-web' directory inside 'uploads' for saving decrypted files
		createAudiosWebDirectory : ->

			runFunc = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
						,(fileSystem)->
							fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/audio-web"
								,{create: true, exclusive:false} 
								
								,(fileEntry)->
									console.log 'audios-web directory path: '+fileEntry.toURL()
									d.resolve fileEntry
								
								,(error)->
									console.log 'ERROR: '+error.code
								)

						,_.fileSystemErrorHandler)

			$.when(runFunc()).done ->
				console.log 'createAudiosWebDirectory done'
			.fail _.failureHandler
			

		
		# Create directory structure inside 'SynapseMedia' for media sync
		createDirectoryStructure : (path)->

			runFunc = ->
				$.Deferred (d)->

					directoryPath = "SynapseAssets/SynapseMedia"

					synapseImagesDirectory = _.createSynapseMediaDirectory()
					synapseImagesDirectory.done ->

						directories = path.split('/')
						directories.pop()

						_.each directories, (directory, key)->

							do(directory)->

								directoryPath = directoryPath + '/' + directory 

								createDirectory = _.createDirectoryBasedOnDirectoryPath directoryPath
								createDirectory.done ->
									console.log 'Created directory: '+directory

						d.resolve directories

			$.when(runFunc()).done ->
				console.log 'createDirectoryStructure done'
			.fail _.failureHandler



		createDirectoryBasedOnDirectoryPath : (directoryPath)->

			runFunc = ->
				$.Deferred (d)->
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
						,(fileSystem)->
							fileSystem.root.getDirectory(directoryPath ,{create: true, exclusive:false} 
								
								,(fileEntry)->
									console.log 'Directory path: '+fileEntry.toURL()
									d.resolve fileEntry
								
								,(error)->
									console.log 'ERROR: '+error.code
								)

						,_.fileSystemErrorHandler)


			$.when(runFunc()).done ->
				console.log 'createDirectoryBasedOnDirectoryPath done'
			.fail _.failureHandler
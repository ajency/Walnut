define ['underscore'], ( _) ->


	_.mixin

		#set 'SynapseMedia' directory path to local storage
		setSynapseMediaDirectoryPathToLocalStorage : ->
			
			defer = $.Deferred()

			_.cordovaCreateDirectory("SynapseAssets")
			.then ->

				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia")
				.then (mediaDirectoryPath)->

					defer.resolve(_.setSynapseMediaDirectoryPath(mediaDirectoryPath))


			defer.promise()




		#Create 'SynapseData' directory inside 'SynapseAssets' for file sync operations
		createSynapseDataDirectory : ->

			defer = $.Deferred()

			_.cordovaCreateDirectory("SynapseAssets")
			.then ->

				_.cordovaCreateDirectory("SynapseAssets/SynapseData")
				.then ->

					defer.resolve(console.log('createSynapseDataDirectory done'))


			defer.promise()




		#new
		createDirectoriesForMediaSync : ->

			defer = $.Deferred()

			_.cordovaCreateDirectory("SynapseAssets")
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia")
			
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads")
					
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/images")
				
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/audios")
				
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/videos")

			.then ->	
				defer.resolve(console.log('createDirectoriesForMediaSync done'))


			defer.promise()




		
		#new sCreate 'videos-web' directory inside 'uploads' for saving decrypted files
		createVideosWebDirectory : ->

			defer = $.Deferred()

			_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads")
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/videos-web")

			.then ->
				defer.resolve(console.log('createVideosWebDirectory done'))


			defer.promise()




		#new Create 'audios-web' directory inside 'uploads' for saving decrypted files
		createAudioWebDirectory : ->

			defer = $.Deferred()

			_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads")
			.then ->
				_.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/audio-web")

			.then ->
				defer.resolve(console.log('createAudioWebDirectory done'))


			defer.promise()
			



		cordovaCreateDirectory : (directory)->

			defer = $.Deferred()

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 
				,(fileSystem)->
					fileSystem.root.getDirectory(directory, {create: true, exclusive:false} 
						
						,(fileEntry)->
							console.log directory+' PATH: '+fileEntry.toURL()
							defer.resolve fileEntry.toURL()
						
						,(error)->
							defer.reject(console.log(directory+' ERROR: '+error.code))
						)

				,_.fileSystemErrorHandler)


			defer.promise()
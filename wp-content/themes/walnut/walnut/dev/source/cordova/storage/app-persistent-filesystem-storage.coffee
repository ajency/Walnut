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
			





		#Check if sdCard path exists
		cordovaCheckIfPathExists : (filepath) ->

			defer = $.Deferred()
			
			window.resolveLocalFileSystemURL('file://'+filepath+''
				,(fileEntry)->

					fileEntry.getDirectory("tempSA",{create: true, exclusive:false} 
						
						,(entry)->
							console.log 'tempSA directory path: '+entry.toURL()
							entry.remove(
								->
									console.log "Sucess"
								, ->
									console.log "error"
								)
							defer.resolve true
						
						,(error)->
							
							defer.resolve false
							console.log 'ERROR: '+error.code
						)

				,->
					console.log 'resolveLocalFileSystemURL error '
					defer.resolve false
					)

			
			defer.promise()


		cordovaCreateDirectory : (directory) ->

			defer = $.Deferred()
			
			value = _.getStorageOption()
			option = JSON.parse(value)
			if option.internal
				filepath = option.internal
			else if option.external
				filepath = option.external
			
			window.resolveLocalFileSystemURL('file://'+filepath+''
				,(fileEntry)->

					fileEntry.getDirectory(directory,{create: true, exclusive:false} 
						
						,(entry)->
							console.log 'directory path: '+entry.toURL()
							defer.resolve entry.toURL()
						
						,(error)->
							
							defer.resolve false
							console.log 'ERROR: '+error.code
						)

				,->
					console.log 'cordovaCreateDirectory error '
					defer.resolve false
					)

			
			defer.promise()
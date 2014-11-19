define ['underscore', 'backbone', 'unserialize'], ( _, Backbone) ->

	# mixin to add additional functionality underscore

	_.mixin


		displayConnectionStatusOnMainLoginPage : ->
			
			if _.isOnline() then $('#connectionStatus').text('Available')
			else $('#connectionStatus').text('Unavailable')




		# change main logo to school logo after initial user login
		setSchoolLogo : ->

			if _.getSchoolLogoSrc() isnt null
				$("#logo").attr('src', _.getSchoolLogoSrc())
			else 
				$("#logo").attr('src', '/images/synapse-logo-main.png')



		cordovaHideSplashscreen : ->

			navigator.splashscreen.hide()
		


		enableCordovaBackbuttonNavigation : ->

			navigator.app.overrideBackbutton(true)
			
			document.addEventListener("backbutton", _.onDeviceBackButtonClick, false)



		disableCordovaBackbuttonNavigation : ->

			navigator.app.overrideBackbutton(false)



		onDeviceBackButtonClick : ->

			currentRoute = App.getCurrentRoute()
			console.log 'Fired cordova back button event for '+currentRoute

			if currentRoute is 'students/dashboard' or currentRoute is 'app-login'
				navigator.app.exitApp()
			else    
				App.navigate('app-login', trigger: true)

			_.removeCordovaBackbuttonEventListener()



		removeCordovaBackbuttonEventListener : ->

			document.removeEventListener("backbutton", _.onDeviceBackButtonClick, false)


		
		cordovaOnlineOfflineEvents : ->

			document.addEventListener("online"
				,=>
					$('#connectionStatus').text('Available')
					
					if not _.isUndefined _.app_username
						$('#onOffSwitch').prop
							"disabled" : false, "checked" : false
				, false)

			document.addEventListener("offline"
				,=>
					$('#connectionStatus').text('Unavailable')
					
					if not _.isUndefined _.app_username
						$('#onOffSwitch').prop
							"disabled" : true, "checked" : false
				, false)


		
		unserialize : (string)->

			if string is '' then string
			else unserialize(string)
		



		# Decrypt the encrypted audio/video local files
		decryptLocalFile : (source, destination)->
			
			$.Deferred (d)->

				decrypt.startDecryption(source, destination
					, ->
						d.resolve destination

					, (message) ->
						console.log 'FILE DECRYPTION ERROR: '+message
				)

		
		#Get Path From The PLugin
		getDeviceStorageOptions : ->
			
			defer = $.Deferred()

			storageOptions = []

			Path.CheckPath(
				(path)->

					if not _.isUndefined(path.ExternalPath)
						storageOptions['Internal'] = path.InternalPath
						storageOptions['External'] = path.ExternalPath

						_.cordovaCheckIfPathExists(path.ExternalPath)
						.then (pathExists)->
							
							if pathExists
								console.log 'Storage Options External'
								defer.resolve storageOptions

							else
								console.log 'Storage Options Internal'
								storageOptions = _.pick storageOptions, 'Internal'
								defer.resolve storageOptions

					else
						storageOptions['Internal'] = path.InternalPath
						defer.resolve storageOptions


				,(error)->
					console.log 'STORAGE ERROR'
					defer.reject(console.log error)
			)

			defer.promise()



		
		clearMediaDirectory : (directory_name)->

			value = _.getStorageOption()
			option = JSON.parse(value)
			if option.internal
				filepath = option.internal
			else if option.external
				filepath = option.external


			# Delete all video files from 'videos-web' folder
			window.resolveLocalFileSystemURL('file://'+filepath+''

				,(fileEntry)->
					
					fileEntry.getDirectory("SynapseAssets/SynapseMedia/uploads/"+directory_name
						, {create: false, exclusive: false}

						, (entry)->
				
							reader = entry.createReader()
				
							reader.readEntries(
								(entries)->
									for i in [0..entries.length-1] by 1
										entries[i].remove()

										if i is entries.length-1
											console.log 'Deleted all files from '+directory_name+' directory'

								,_.directoryErrorHandler)
				
						, _.directoryErrorHandler)
			
				, _.fileSystemErrorHandler)
			


		#Get current date
		getCurrentDateTime : (bit)->
			# bit = 0 - date
			#     = 1 - time 
			#     = 2 - date and time

			d = new Date()
			date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
			time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()

			return date if bit is 0
			return time if bit is 1
			return date+' '+time if bit is 2


		
		audioQueuesSelection : (selectedAction)->
			if _.platform() is "DEVICE"
				if not _.isNull(_.getAudioCues())
					if _.getAudioCues() isnt 'false'
						audioCues = null
						filepathForIndividualAudio = null
						
						filepath = "/android_asset/www/audioCues/"
						switch selectedAction
							when 'Click-Next'
							
								filepathForIndividualAudio = filepath + "nextClick.WAV"

							when 'Click-Select'
								navigator.notification.vibrate(1000);
								filepathForIndividualAudio = filepath + "selectClick.WAV"


							when 'Click-Start'

								filepathForIndividualAudio = filepath + "startClick.WAV"

							when 'Click-Unselect'
								navigator.notification.vibrate(1000);
								filepathForIndividualAudio = filepath + "unselectClick.WAV"

							when 'Click-Save'

								filepathForIndividualAudio = filepath + "saveClick.WAV"

							when 'Click-Pause'
								
								filepathForIndividualAudio = filepath + "pauseClick.WAV"

						audioCues = new Media filepathForIndividualAudio 
												,->
													console.log "media played"
												,(error)->
													console.log "error"+error.code

						audioCues.play()
						setTimeout(=>
							audioCues.release()
						,2000)


		setAudioCuesToggle : ->
			if _.getAudioCues() is 'true'
				$('#onOffSwitchToggle').prop "checked" : true
			else
				$('#onOffSwitchToggle').prop "checked" : false



		getUserDetails : (userID)->

			userDetails = user_id: '', username: '', display_name: '', password: ''
					, user_capabilities: '', user_role: '', cookie: '', blog_id: ''
					, user_email: '', division: ''

			defer = $.Deferred()
			
			onSuccess = (tx, data)->
				userDetails = ''
				if data.rows.length isnt 0
					row = data.rows.item(0)

					userDetails =
						user_id : row['user_id']
						username: row['username']
						display_name: row['display_name']
						password : row['password']
						user_capabilities: row['user_capabilities']
						user_role : row['user_role']
						cookie: row['cookie']
						blog_id: row['blog_id']
						user_email: row['user_email']
						division: row['division']


				defer.resolve userDetails

			_.db.transaction (tx)->
				tx.executeSql "SELECT * FROM USERS WHERE user_id=?"
					, [userID]
				, onSuccess, _.transactionErrorHandler

			defer.promise()


		initLocalVideosCheck :(videoIds) ->

			defer = $.Deferred()
			# navigator.notification.activityStart("Please wait", "loading content...")
			videoIdAndUrl = new Array()

			# decryptedDestinationVideoPath = []
			
			_.createVideosWebDirectory().done =>
				forEach = (videoId, index)->
					_.getMediaById(videoId).then (video)->
						# navigator.notification.activityStart("Please wait", "loading content...")
						
							
						url = video.url.replace("media-web/","")
						videosWebUrl = url.substr(url.indexOf("uploads/"))
						videoUrl = videosWebUrl.replace("videos-web", "videos")
						encryptedPath = "SynapseAssets/SynapseMedia/"+videoUrl
						decryptedPath = "SynapseAssets/SynapseMedia/"+videosWebUrl
						
						value = _.getStorageOption()
						option = JSON.parse(value)

						encryptedVideoPath = '' 
						decryptedVideoPath = ''

						if option.internal
							encryptedVideoPath = option.internal+'/'+encryptedPath
							decryptedVideoPath = option.internal+'/'+decryptedPath
						else if option.external
							encryptedVideoPath = option.external+'/'+encryptedPath
							decryptedVideoPath = option.external+'/'+decryptedPath

						
						# deferreds = _.decryptLocalFile(encryptedVideoPath, decryptedVideoPath)
						# deferreds.done (localVideoPath)=>

						# 	navigator.notification.activityStop()
						# 	console.log localVideoPath
						# 	decryptedPath = 'file://'+localVideoPath
							
						videoIdAndUrl[index] =
							encryptedPath : encryptedVideoPath
							decryptedPath : decryptedVideoPath
							url:'file://' + decryptedVideoPath
							vId : videoId

							
						index = index + 1
						
						if index < _.size(videoIds)
							forEach videoIds[index], index

						else
							defer.resolve videoIdAndUrl
							
				
				forEach videoIds[0], 0
							

			defer.promise()



		decryptVideos :(videoIdAndUrl)->
			
			defer = $.Deferred()
			
			decryptedVideoPath = new Array()

			forEach = (videoId, index)->
				
				_.decryptLocalFile(videoId.encryptedPath, videoId.decryptedPath)
				.then (localVideoPath)=>

					# navigator.notification.activityStop()
					# console.log localVideoPath

					index = index + 1
					if index < _.size(videoIdAndUrl)
						decryptedVideoPath[index-1] = 'file://'+localVideoPath
						decryptedVideoPath[index-1] =
							videoDecryptedPath : 'file://'+localVideoPath
							vId : videoId.vId
						forEach videoIdAndUrl[index], index

					else
						decryptedVideoPath[index-1] =
							videoDecryptedPath : 'file://'+localVideoPath
							vId : videoId.vId
						
						defer.resolve decryptedVideoPath


			forEach videoIdAndUrl[0], 0
			
			defer.promise()

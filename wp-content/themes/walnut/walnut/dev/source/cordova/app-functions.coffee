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

		
		getDeviceStorageOptions : ->
			
			defer = $.Deferred()

			storageOptions = []

			Path.CheckPath(
				(path)->

					if not _.isUndefined(path.ExternalPath)
						storageOptions['Internal'] = path.InternalPath
						storageOptions['External'] = path.ExternalPath

					else
						storageOptions['Internal'] = path.InternalPath
					
					console.log 'Storage Options'
					console.log storageOptions
					defer.resolve storageOptions

				,(error)->
					console.log 'STORAGE ERROR'
					defer.reject(console.log error)
			)

			defer.promise()



		
		clearMediaDirectory : (directory_name)->
			# Delete all video files from 'videos-web' folder
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem)->
				fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/"+directory_name
					, {create: false, exclusive: false}

					, (directoryEntry)->
						reader = directoryEntry.createReader()
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
			# 	  = 1 - time 
			# 	  = 2 - date and time

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
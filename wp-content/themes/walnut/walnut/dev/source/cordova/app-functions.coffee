define ['underscore', 'backbone', 'unserialize'], ( _, Backbone) ->

	# mixin to add additional functionality underscore

	_.mixin


		getTblPrefix : ->

			'wp_'+_.getBlogID()+'_'


		displayConnectionStatusOnMainLoginPage : ->
			
			if _.isOnline() then $('#connectionStatus').text('Available')
			else $('#connectionStatus').text('Unavailable')


		
		# change main logo to school logo after initial user login
		setSchoolLogo : ->

			if _.getSchoolLogoSrc() isnt null
				$("#logo").attr('src', _.getSchoolLogoSrc())
			else 
				$("#logo").attr('src', './images/synapse-logo-main.png')



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

			if currentRoute is 'teachers/dashboard' or currentRoute is 'app-login'
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
		
	
		
		#Get all user details from local database
		getUserDetails : (username)->

			defer = $.Deferred()

			userData = user_id : '', password: '', role : '', exists : false

			onSuccess = (tx, data)->

				if data.rows.length isnt 0

					row = data.rows.item(0)

					userData =
						user_id : row['user_id']
						password : row['password']
						role : row['user_role']
						exists : true

				defer.resolve userData


			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM USERS 
								WHERE username=?"
								, [username]

				, onSuccess, _.transactionErrorHandler

			
			defer.promise()


		
		#Get meta_value from wp_postmeta
		getMetaValue : (content_piece_id)->

			defer = $.Deferred()

			meta_value = content_type : '', layout_json : '', question_type : ''
						, post_tags : '', duration : '', last_modified_by : ''
						, published_by : '', term_ids : '', instructions: ''

			onSuccess = (tx, data)->

				length = data.rows.length
				
				if length is 0
					defer.resolve meta_value
				else
					forEach = (row, i)->

						if row['meta_key'] is 'content_type'
							meta_value.content_type = row['meta_value']

						if row['meta_key'] is 'layout_json'
							meta_value.layout_json = _.unserialize(row['meta_value'])

						if row['meta_key'] is 'question_type'
							meta_value.question_type = row['meta_value']	

						if row['meta_key'] is 'content_piece_meta'
							content_piece_meta = _.unserialize(row['meta_value'])

							meta_value.post_tags = content_piece_meta.post_tags
							meta_value.duration = content_piece_meta.duration
							meta_value.last_modified_by = content_piece_meta.last_modified_by
							meta_value.published_by = content_piece_meta.published_by
							meta_value.term_ids = content_piece_meta.term_ids
							meta_value.instructions = content_piece_meta.instructions

						i = i + 1
						if i < length
							forEach data.rows.item(i), i
						else
							defer.resolve meta_value


					forEach data.rows.item(0), 0

			
			_.db.transaction (tx)->

				tx.executeSql "SELECT * 
								FROM wp_postmeta 
								WHERE post_id=?"
								, [content_piece_id]

				, onSuccess, _.transactionErrorHandler


			defer.promise()


		
		# Decrypt local files
		decryptLocalFile : (source, destination)->

			defer = $.Deferred()

			decrypt.startDecryption(source, destination
				, ->
					console.log 'Decrypted File: '+destination
					defer.resolve destination

				, (message) ->

					defer.resolve destination
					# defer.resolve(console.log('FILE DECRYPTION ERROR: '+message))
					# navigator.notification.activityStop()
			)


			defer.promise()

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



		downloadSchoolLogo  : (logo_url)->

			window.requestFileSystem(LocalFileSystem.TEMPORARY, 0 ,(fileSystem)->
				fileSystem.root.getFile("logo.jpg", {create: true, exclusive:false} 
					,(fileEntry)->
						
						filePath = fileEntry.toURL().replace("logo.jpg", "")
						fileEntry.remove()
						uri = encodeURI(logo_url)

						fileTransfer = new FileTransfer()
						fileTransfer.download(uri, filePath+"logo.jpg" 
							,(file)->
								console.log 'School logo download successful'
								console.log 'Logo file source: '+file.toURL()
								_.setSchoolLogoSrc(file.toURL())

							,_.fileTransferErrorHandler, true)
					
					,_.fileErrorHandler)

			,_.fileSystemErrorHandler)

		
		
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

		
		
		audioQueuesSelection : (selectedAction)->

			#TODO: Change if condition
			if not _.isNull(_.getAudioCues())
				if _.getAudioCues() isnt 'false'
					audioCues = null
					filepathForIndividualAudio = null
					filepath = "/android_asset/www/audioCues/"

					switch selectedAction

						when 'Click-Next'
							filepathForIndividualAudio = filepath + "nextClick.WAV"

						when 'Click-Select'
							navigator.notification.vibrate(50);
							filepathForIndividualAudio = filepath + "selectClick.WAV"

						when 'Click-Start'
							filepathForIndividualAudio = filepath + "startClick.WAV"

						when 'Click-Unselect'
							navigator.notification.vibrate(50);
							filepathForIndividualAudio = filepath + "unselectClick.WAV"

						when 'Click-Save'

							filepathForIndividualAudio = filepath + "saveClick.WAV"

						when 'Click-Pause'
							
							filepathForIndividualAudio = filepath + "pauseClick.WAV"

					audioCues = new Media filepathForIndividualAudio 
						, -> 
							console.log "media played"
						, (error)->
							console.log "error"+error.code

					audioCues.play()
					setTimeout(->
						audioCues.release()
					,2000)

		
		
		setAudioCuesToggle : ->

			if _.getAudioCues() is 'true'
				$('#onOffSwitchToggle').prop "checked" : true
			else
				$('#onOffSwitchToggle').prop "checked" : false



		#Get current date and time
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



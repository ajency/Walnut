define ['underscore', 'backbone', 'unserialize'], ( _, Backbone) ->

	# mixin to add additional functionality underscore

	_.mixin

		getTheBlogId : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT blog_id FROM USERS WHERE user_id=?" 
							,[id] 
							onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					blog_id= ''
					if data.rows.length isnt 0
						blog_id = data.rows.items(0)['blog_id']
						console.log blog_id
					d.resolve blog_id


			$.when(runQuery()).done ->
				console.log 'get blog id from the local users table'
			.fail _.failureHandler

					

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

			userData = user_id : '', password: ''
					, role : '',user_email : '',session_id : '' 
					,blog_id : '' ,division:'' ,exists : false

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
							tx.executeSql("SELECT * FROM USERS WHERE username=?"
								, [username], onSuccess(d), _.deferredErrorHandler(d))	
			
			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0
						row = data.rows.item(0)
						userData =
							user_id : row['user_id']
							password : row['password']
							role : row['user_role']
							session_id:row['session_id']
							blog_id:row['blog_id']
							user_email:row['user_email']
							division:row['division']
							exists : true

						console.log userData

					d.resolve(userData)

			$.when(runQuery()).done ->
				console.log 'getUserDetails transaction completed'
			.fail _.failureHandler




		# Decrypt the encrypted audio/video local files
		decryptLocalFile : (source, destination)->

			$.Deferred (d)->

				decrypt.startDecryption(source, destination
					, ->
						d.resolve destination

					, (message) ->
						console.log 'FILE DECRYPTION ERROR: '+message
				)


		
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



		#Fetch single division id for student
		getSingleDivsionByUserId : (id)->

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? 
							AND meta_key=?", [id, 'student_division']
							,onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					id = ''
					if data.rows.length isnt 0
						id = data.rows.item(0)['meta_value']
						console.log id

					d.resolve id

			$.when(runQuery()).done ->
				console.log 'fetchSingleDivsion transaction completed'
			.fail _.failureHandler



		getUserEmail :->
			userDetails = user_email : '', username : ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
							tx.executeSql("SELECT * FROM USERS WHERE user_id=?"
								, [_.getUserID()], onSuccess(d), _.deferredErrorHandler(d))	
			
			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0
						row = data.rows.item(0)
						userDetails =
							user_email: row['user_email']
							username: row['username']

						console.log userDetails

					d.resolve(userDetails)

			$.when(runQuery()).done ->
				console.log 'getUserEmail transaction completed'
			.fail _.failureHandler


		

		# user model set for back button navigation
		setUserModel : ->
			
			user = App.request "get:user:model"
			user.set 'ID' :''+_.getUserID()

			if not _.isNull(_.getUserCapabilities())
				user.set 'allcaps' : _.getUserCapabilities()

			singleDivision = @getSingleDivsionByUserId(_.getUserID())
			singleDivision.done (division)->

				userDeatils = _.getUserEmail()
				userDeatils.done (userData)->

					console.log JSON.stringify userData
					
					data = 
						'division': division
						'ID': _.getUserID()
						'display_name': _.getUserName()
						'user_email': _.getUserEmail()



					user.set 'data' : data






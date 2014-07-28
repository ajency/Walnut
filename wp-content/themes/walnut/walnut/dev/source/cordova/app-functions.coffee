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

			userData = user_id : '', password: '', role : '', exists : false

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
							exists : true

					d.resolve(userData)

			$.when(runQuery()).done ->
				console.log 'getUserDetails transaction completed'
			.fail _.failureHandler


		
		#Get meta_value from wp_postmeta
		getMetaValue : (content_piece_id)->

			meta_value = 
				content_type : ''
				layout_json : ''
				question_type : ''
				post_tags : ''
				duration : ''
				last_modified_by : ''
				published_by : ''
				term_ids : ''
				instructions: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?"
							, [content_piece_id], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx, data)->
					for i in [0..data.rows.length-1] by 1
						row = data.rows.item(i)
						
						do(row)->

							if row['meta_key'] is 'content_type'
								meta_value.content_type = row['meta_value']

							if row['meta_key'] is 'layout_json'
								meta_value.layout_json = _.unserialize(_.unserialize(row['meta_value']))

							if row['meta_key'] is 'question_type'
								meta_value.question_type = row['meta_value']	

							if row['meta_key'] is 'content_piece_meta'
								content_piece_meta = _.unserialize(_.unserialize(row['meta_value']))

								meta_value.post_tags = content_piece_meta.post_tags
								meta_value.duration = content_piece_meta.duration
								meta_value.last_modified_by = content_piece_meta.last_modified_by
								meta_value.published_by = content_piece_meta.published_by
								meta_value.term_ids = content_piece_meta.term_ids
								meta_value.instructions = content_piece_meta.instructions
								

					d.resolve(meta_value)

			$.when(runQuery()).done ->
				console.log 'getMetaValue transaction completed'
			.fail _.failureHandler


		
		# Decrypt the encrypted video file
		decryptVideoFile : (source, destination)->

			runFunc = ->
				$.Deferred (d)->

					decrypt.startDecryption(source, destination
						, ->
							d.resolve destination

						, (message) ->
							console.log 'ERROR: '+message
					)

			$.when(runFunc()).done ->
				console.log 'Decrypted video file at location: '+destination 
			.fail _.failureHandler


		
		clearVideosWebDirectory : ->
			# Delete all video files from 'videos-web' folder
			# window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem)->
			# 	fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/videos-web"
			# 		, {create: false, exclusive: false}

			# 		, (directoryEntry)->
			# 			reader = directoryEntry.createReader()
			# 			reader.readEntries(
			# 				(entries)->
			# 					for i in [0..entries.length-1] by 1
			# 						entries[i].remove()

			# 						if i is entries.length-1
			# 							console.log 'Deleted all video files from videos-web directory'

			# 				,_.directoryErrorHandler)
			# 		, _.directoryErrorHandler)
			# , _.fileSystemErrorHandler)
			


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
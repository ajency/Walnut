define ["marionette","app", "underscore"], (Marionette, App, _) ->
	
	#Controls login authentication based on platform

	class AuthenticationController extends Marionette.Controller

		initialize : (options)->

			{@url, @data, @success} = options

			@platform = _.platform()

			@isOnline = _.isOnline()


		authenticate :->

			switch @platform

				when 'BROWSER'
					@browserLogin()	

				when 'DEVICE'
					@deviceLogin()

		
		browserLogin : ->

			if @isOnline then @onlineWebAuth() else @onConnectionError()

		
		deviceLogin : ->

			if @isOfflineLoginEnabled() then @offlineDeviceAuth()
			else 
				if @isOnline then @onlineDeviceAuth()
				else @onConnectionError()
		


		# login for website
		onlineWebAuth:->

			$.post @url, data: @data, @success, 'json'	

		
		isOfflineLoginEnabled:->

			if($('#offline').is(':checked')) then true else false

		
		# login for device
		onlineDeviceAuth:->

			$.post AJAXURL + '?action=get-user-app-profile', 
				   data: @data,
				   (resp)=>
				   		console.log 'RESP'
				   		console.log resp
				   		if resp.error
				   			@onErrorResponse(resp.error)	

				   		else
				   			# set user model for back button navigation
				   			@setUserModel()

				   			# save logged in user id and username
				   			_.setUserID(resp.login_details.ID)
				   			_.setUserName(@data.txtusername)

				   			# if the blog id is null, then the app is installed
				   			# for the first time.
				   			if _.getBlogID() is null then @initialAppLogin(resp)
				   			else @authenticateUserBlogId(resp)
				   	,
				   	'json'	


		

		
		# offline login for device
		offlineDeviceAuth : ->

			offlineUser = _.getUserDetails(@data.txtusername)

			offlineUser.done (user)=>
				if user.exists
					if user.password is @data.txtpassword
						# set user model for back button navigation
						@setUserModel()

						# save offline user id and username
						_.setUserID(user.user_id)
						_.setUserName(@data.txtusername)

						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')		

				else @onErrorResponse('No such user has previously logged in')


		# when the app is installed for the first time
		initialAppLogin : (server_resp)->

			resp = server_resp.blog_details
			_.setDwnlduri(server_resp.exported_csv_url)

			TimeStampValue=server_resp.exported_csv_url

			_.setDwnldTimeStamp(TimeStampValue)
			
			# set blog id and blog name
			_.setBlogID(resp.blog_id)
			_.setBlogName(resp.blog_name)

			#Local transaction
			_.localDatabaseTransaction(_.db)

			# download school logo
			_.downloadSchoolLogo(resp.blog_logo)
			
			@firstLoginDownload()
			
			@saveUpdateUserDetails(server_resp)
			@onSuccessResponse()

		
		# compare users blog id to that of the locally saved blog id
		authenticateUserBlogId : (server_resp)->

			resp = server_resp.blog_details

			if resp.blog_id isnt _.getBlogID()
				@onErrorResponse('The app is configured for school '+_.getBlogName())
			else
				@saveUpdateUserDetails(server_resp)
				@onSuccessResponse()
		
		
		#Download the data from server for 1st time login
		firstLoginDownload :->
			# dwnldUnZip



		# save new user or update existing user 
		saveUpdateUserDetails : (resp)->

			offlineUser = _.getUserDetails(@data.txtusername)
			
			offlineUser.done (user)=>
				if user.exists then @updateExistingUser(resp)
				else @inputNewUser(resp)
		
		
		inputNewUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES (?, ?, ?, ?)', 
					[resp.ID, @data.txtusername, @data.txtpassword, resp.roles[0]])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)

		
		updateExistingUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", 
					[@data.txtusername, @data.txtpassword, resp.ID])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Updated user details'
			)

		
		onConnectionError :->

			response = 
				error : 'Connection could not be established. Please try again.'
			@success response

		
		onSuccessResponse :->

			response = 
				success : true
			@success response

		
		onErrorResponse :(msg)->

			response = 
				error : ''+msg
			@success response	

		
		# user model set for back button navigation
		setUserModel : ->
			
			user = App.request "get:user:model"
			user.set 'ID' : ''+_.getUserID()


 	# request handler
 	App.reqres.setHandler "get:auth:controller",(options)->
 		new AuthenticationController options



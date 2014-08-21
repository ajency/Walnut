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


		onlineWebAuth:->

			$.post @url, data: @data, @success, 'json'  

		
		deviceLogin : ->

			if @isOfflineLoginEnabled() then @offlineDeviceAuth()
			else 
				if @isOnline then @onlineDeviceAuth()
				else @onConnectionError()
			

		
		isOfflineLoginEnabled:->

			if ($('#onOffSwitch').is(':checked')) then false else true

		
		
		onlineDeviceAuth:->

			$.post AJAXURL + '?action=get-user-app-profile',
				data: @data,
				(resp)=>
					console.log 'Login Response'
					console.log JSON.stringify resp
					if resp.error
						@onErrorResponse(resp.error)
					else
						# @setUserDetails(resp.login_details.ID, @data.txtusername)
						@onDeviceLoginSuccess(resp)

				,
				'json'

			.fail =>
				@onErrorResponse('Could not connect to server')


		
		onDeviceLoginSuccess :(serverResponse)->

			_.setSiteUrl(serverResponse.blog_details.site_url)

			`var baseUrl =  AJAXURL.substr(AJAXURL.indexOf("/wp-admin"));
			AJAXURL = _.getSiteUrl() + baseUrl;`

			$.post AJAXURL + '?action=get-user-app-profile',
				data: @data,
				(resp)=>
					console.log 'User Response'
					console.log JSON.stringify resp
					
					if resp.error
						@onErrorResponse(resp.error)
					else
						userRole = resp.login_details.roles[0]
						if userRole is "teacher"
							@onErrorResponse("Your are not allowed to login")

						else if userRole is "student"
							@setUserDetails(resp.login_details.ID, @data.txtusername)
							_.setUserCapabilities(resp.login_details.allcaps)
							_.setStudentDivision(resp.login_details.data.division)
							_.createDataTables(_.db)
							@saveUpdateUserDetails(resp)
							@onSuccessResponse()

				,
				'json'

			.fail =>
				@onErrorResponse('Could not connect to server')




		offlineDeviceAuth : ->

			offlineUser = _.getUserDetails(@data.txtusername)

			offlineUser.done (user)=>
				if user.exists
					if user.password is @data.txtpassword

						@setUserDetails(user.user_id, @data.txtusername)
						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')       

				else @onErrorResponse('No such user has previously logged in')


		
		setUserDetails : (id, username)-> 
			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)

			# set user model for back button navigation
			_.setUserModel()



		# save new user or update existing user 
		saveUpdateUserDetails : (resp)->

			offlineUser = _.getUserDetails(@data.txtusername)
			
			offlineUser.done (user)=>
				if user.exists then @updateExistingUser(resp)
				else @inputNewUser(resp)
		
		
		inputNewUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) 
					VALUES (?, ?, ?, ?)', 
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





	# request handler
	App.reqres.setHandler "get:auth:controller",(options)->
		new AuthenticationController options
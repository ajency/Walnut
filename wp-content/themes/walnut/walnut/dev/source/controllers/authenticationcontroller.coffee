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
					console.log resp
					if resp.error
						@onErrorResponse(resp.error)
					else
						@onDeviceLoginSuccessOperation(resp.login_details.ID, @data.txtusername)

						# if the blog id is null, then the app is installed
						# for the first time.
						@initialAppLogin(resp)
				,
				'json'

			.fail =>
				@onErrorResponse('Could not connect to server')


		offlineDeviceAuth : ->

			offlineUser = _.getUserDetails(@data.txtusername)

			offlineUser.done (user)=>
				if user.exists
					if user.password is @data.txtpassword

						@onDeviceLoginSuccessOperation(user.user_id, @data.txtusername)
						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')       

				else @onErrorResponse('No such user has previously logged in')


		
		onDeviceLoginSuccessOperation : (id, username)-> 
			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)

			# set user model for back button navigation
			_.setUserModel()


		
		# when the app is installed for the first time
		initialAppLogin : (server_resp)->

			resp = server_resp.blog_details
			
			# set blog id, blog name and Site url
			_.setSiteUrl(resp.site_url)

			# local transaction
			_.createDataTables(_.db)

			# download school logo
			# _.downloadSchoolLogo(resp.blog_logo)
			
			@saveUpdateUserDetails(server_resp)

			_.setStudentDivision(server_resp.login_details.data.division)
			@setUserCapabilities()



		setUserCapabilities : ->

			`var baseUrl =  AJAXURL.substr(AJAXURL.indexOf("/wp-admin"));
			AJAXURL = _.getSiteUrl() + baseUrl;`

			$.post AJAXURL + '?action=get-user-app-profile',
				data: @data,
				(resp)=>
					console.log 'User Response'
					console.log resp
					if resp.error
						@onErrorResponse(resp.error)
					else
						_.setUserCapabilities(resp.login_details.allcaps)
						_.setUserModel()
						@onSuccessResponse()
				,
				'json'

			.fail =>
				@onErrorResponse('Could not connect to server')



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
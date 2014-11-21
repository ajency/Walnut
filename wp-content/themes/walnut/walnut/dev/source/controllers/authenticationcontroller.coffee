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

		
		
		onlineDeviceAuth : -> 

			$.post AJAXURL + '?action=get-user-app-profile',
				data: @data,
				(resp)=>
					
					if resp.error
						@onErrorResponse(resp.error)
					else
						@onlineDeviceAuthSuccess(resp)
				,
				'json'

			.fail =>
				@onErrorResponse('Could not connect to server')


		
		onlineDeviceAuthSuccess : (resp)->

			user_role = resp.blog_details.blog_roles[0]

			if user_role is 'teacher'
							
				@setUserDetails(resp, resp.login_details.ID, @data.txtusername)

				# if the blog id is null, then the app is installed
				# for the first time.
				if _.isNull(_.getBlogID()) then @initialAppLogin(resp)
				else @authenticateUserBlogId(resp)

			else
				@onErrorResponse('Sorry this is not a valid teacher login. 
					If you are a student please download Student training 
					app from Google Playstore.')


		
		offlineDeviceAuth : ->

			_.getUserDetails(@data.txtusername).done (user)=>

				if user.exists
					if user.password is @data.txtpassword
						getDisplayName = _.getPostAuthorName(_.getUserID())
						getDisplayName.done (display_name)->
							@setOflineUserDetails(display_name, user.user_id, @data.txtusername)
							@onSuccessResponse()

					else @onErrorResponse('Invalid Password')    

				else @onErrorResponse('No such user has previously logged in')

		
		
		setUserDetails : (resp , id, username)-> 

			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)

			login = resp.login_details
			# set user model
			userModel = App.request "get:user:model"
			
			data = 
				'ID': login.ID
				'display_name': login.data.display_name
			
			userModel.set 
				'data' : data
				'ID' : id
			# userModel.set 'ID' : ''+_.getUserID()



		setOflineUserDetails : (display_name,id,username)->
			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)

			# login = resp.login_details
			# set user model
			userModel = App.request "get:user:model"
			
			data = 
				'ID': id
				'display_name': display_name
			
			userModel.set 
				'data' : data
				'ID' : id
			# userModel.set 'ID' : ''+_.getUserID()


		setUserModelForOfflineLogin : ->
			
			_.getUserDetails(_.getUserID())
			.then (userDetails)=>

				_.setTblPrefix(userDetails.blog_id)

				user = App.request "get:user:model"

				data = 
					'ID': userDetails.user_id
					'division': userDetails.division
					'display_name': userDetails.username
					'user_email': userDetails.user_email


				user.set 
					'data' : data
					'ID' 	: userDetails.user_id

				App.vent.trigger "show:dashboard"
				App.loginRegion.close()
		# when the app is installed for the first time
		initialAppLogin : (server_resp)->

			resp = server_resp.blog_details
			
			# set blog id and blog name
			_.setBlogID(resp.blog_id)
			_.setBlogName(resp.blog_name)

			# local transaction
			_.createDataTables(_.db)

			# download school logo
			_.downloadSchoolLogo(resp.blog_logo)
			
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



		# save new user or update existing user 
		saveUpdateUserDetails : (resp)->

			_.getUserDetails(@data.txtusername).done (user)=>
				
				if user.exists then @updateExistingUser(resp)
				else @inputNewUser(resp)
		
		
		inputNewUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) 
					VALUES (?, ?, ?, ?)', 
					[resp.ID, @data.txtusername, @data.txtpassword, resp.roles[0]])

			,_.transactionErrorHandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)

		
		updateExistingUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", 
					[@data.txtusername, @data.txtpassword, resp.ID])

			,_.transactionErrorHandler 
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


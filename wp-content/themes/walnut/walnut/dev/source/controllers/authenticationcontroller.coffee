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
			@data = 
				data: @data
			url = AJAXURL + '?action=get-user-app-profile' 
			$.ajax 
				type: 'POST' 
				url : url  
				data: @data   
				dataType: 'json' 
				xhrFields: 
						withCredentials: true 
				beforeSend: (xhr)->
					if not _.isNull(_.getCookiesValue())
						if _.getCookiesValue() isnt 'null'
							console.log _.getCookiesValue()
							xhr.setRequestHeader('Set-Cookie', _.getCookiesValue()); 
				success : (resp, status, jqXHR)=>
					console.log 'Login Response'
					console.log JSON.stringify resp
					if resp.error
						@onErrorResponse(resp.error)
					else
						userRole = resp.login_details.roles[0]
						if userRole is "teacher"
							@onErrorResponse("Your are not allowed to login")

						else if userRole is "student"
							store_cookies = jqXHR.getResponseHeader('Set-Cookie');
							console.log store_cookies
							_.setCookiesValue(store_cookies);
							_.setBlogID 8
							_.setSyncRequestId 1
							# @storeUserSessionCookie(resp, store_cookies)
							@setUserDetails(resp.login_details.ID, @data.data.txtusername)
							_.setUserCapabilities(resp.login_details.allcaps)
							_.setStudentDivision(resp.login_details.data.division)
							_.createDataTables(_.db)
							@saveUpdateUserDetails(resp)
							@onSuccessResponse()

				error :(jqXHR, err) =>
					@onErrorResponse('Could not connect to server')



		offlineDeviceAuth : ->
			console.log @data.data.txtusername
			offlineUser = _.getUserDetails(@data.data.txtusername)

			offlineUser.done (user)=>
				if user.exists
					if user.password is data.data.txtpassword

						@setUserDetails(user.user_id, @data.data.txtusername)
						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')       

				else @onErrorResponse('No such user has previously logged in')


		
		setUserDetails : (id, username)-> 
			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)

			# set user model for back button navigation
			_.setUserModel()


		#save users session info
		# storeUserSessionCookie : (response , store_cookies)->
		# 	resp = response.login_details

		# 	_.db.transaction((tx)=>
		# 		tx.executeSql('INSERT INTO user_session_value_check (user_id, username, session_id) 
		# 			VALUES(?,?,?)', 
		# 			[resp.ID, @data.data.txtusername, store_cookies])
		# 	,_.transactionErrorhandler 
		# 	,(tx)->
		# 		console.log 'success: inserted values in user_session_value_check'
		# 	)


		# save new user or update existing user 
		saveUpdateUserDetails : (resp)->

			offlineUser = _.getUserDetails(@data.data.txtusername)
			
			offlineUser.done (user)=>
				if user.exists then @updateExistingUser(resp)
				else @inputNewUser(resp)
		

		inputNewUser : (response)->
 
			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) 
					VALUES (?, ?, ?, ?)', 
					[resp.ID, @data.data.txtusername, data.data.txtpassword, resp.roles[0]])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)

		
		updateExistingUser : (response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", 
					[@data.data.txtusername, data.data.txtpassword, resp.ID])

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
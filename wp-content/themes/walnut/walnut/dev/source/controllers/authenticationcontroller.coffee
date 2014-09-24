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
							
							_.setCookiesValue(store_cookies);

							
							@setUserDetails(resp.login_details.ID, @data.data.txtusername, 
								resp.blog_details.blog_id, resp.login_details.data.user_email
								, resp.login_details.data.division)

							@saveUpdateUserDetails(resp, jqXHR)

							_.setUserCapabilities(resp.login_details.allcaps)
							_.setStudentDivision(resp.login_details.data.division)
							_.createDataTables(_.db)
							@onSuccessResponse()

				error :(jqXHR, err) => 
					@onErrorResponse('Could not connect to server')



		offlineDeviceAuth : -> 
			u_name = user_name : @data.txtusername
			offlineUser = _.getUserDetails(u_name)

			offlineUser.done (user)=>
				if user.exists 
					if user.password is @data.txtpassword

						@setUserDetails(user.user_id, @data.txtusername
							, user.blog_id, user.user_email, user.division)
						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')       

				else @onErrorResponse('No such user has previously logged in')


		
		setUserDetails : (id, username,blog_id,user_email,division)-> 
			# save logged in user id and username
			_.setUserID(id)
			_.setUserName(username)
			_.setBlogID(blog_id)
			_.setUserEmail(user_email)

			# set user model for back button navigation
			_.setUserModel()
			




		# save new user or update existing user 
		saveUpdateUserDetails : (resp, jqXHR)-> 
			u_name = user_name:@data.data.txtusername
			offlineUser = _.getUserDetails(u_name)
			
			offlineUser.done (user)=>
				if user.exists then @updateExistingUser(resp,jqXHR)
				else @inputNewUser(resp,jqXHR)
		

		inputNewUser : (response, jqXHR)->
 
			resp = response.login_details
			cookie = jqXHR.getResponseHeader('Set-Cookie')

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role, 
					session_id, blog_id, user_email, division) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
					[resp.ID, @data.data.txtusername, @data.data.txtpassword, resp.roles[0], 
					cookie, response.blog_details.blog_id
					, response.login_details.data.user_email, response.login_details.data.division])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
				
			)

		
		updateExistingUser : (response, jqXHR)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=?, user_email=?, division=? where user_id=?", 
					[@data.data.txtusername, @data.data.txtpassword, resp.ID
					, response.blog_details.blog_id, response.login_details.data.user_email
					, response.login_details.data.division])

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
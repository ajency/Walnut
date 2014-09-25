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
			

		
		isOfflineLoginEnabled : ->

			if ($('#onOffSwitch').is(':checked')) then false else true

		
		onlineDeviceAuth : ->

			@data = data: @data

			$.ajax 
				type: 'POST' 
				url : AJAXURL + '?action=get-user-app-profile'  
				data: @data   
				dataType: 'json' 
				xhrFields: 
						withCredentials: true

				# beforeSend: (xhr)->
				# 	if not _.isNull(_.getCookiesValue())
				# 		if _.getCookiesValue() isnt 'null'
				# 			console.log _.getCookiesValue()
				# 			xhr.setRequestHeader('Set-Cookie', _.getCookiesValue()); 

				success : (resp, status, xhr)=>
					
					if resp.error
						@onErrorResponse(resp.error)
					else
						_.each resp.login_details.roles, (userRole)=>

							if userRole is "teacher"
								@onErrorResponse("Your are not allowed to login")

							else if userRole is "student"

								cookie = xhr.getResponseHeader('Set-Cookie'); 

								_.setUserID(resp.login_details.ID)
								@setUserModelForOnlineLogin(resp)

								userDetails = resp: resp, cookie: cookie, userRole: userRole
								@saveUpdateUserDetails(userDetails)
								
								@onSuccessResponse()

				error :(err) => 
					@onErrorResponse('Could not connect to server')



		setUserModelForOnlineLogin : (resp)->
			
			blog = resp.blog_details
			_.setTblPrefix(blog.blog_id)

			login = resp.login_details

			user = App.request "get:user:model"
			data = 
				'ID': resp.ID
				'division': login.data.division
				'display_name': login.data.username
				'user_email': login.data.user_email
			
			user.set 'data' : data

			#Create tables based on the users blog id
			_.createDataTables(_.db)


		# save new user or update existing user 
		saveUpdateUserDetails : (userDetails)->

			existingUser = @isExistingUser(@data.data.txtusername)
			existingUser.done (user)=>

				if user.exists then @updateExistingUser(userDetails)
				else @inputNewUser(userDetails)


		inputNewUser : (userDetails)->

			login = userDetails.resp.login_details
			blog = userDetails.resp.blog_details
			cookie = userDetails.cookie
			userRole = userDetails.userRole

			_.db.transaction((tx)=>
				tx.executeSql("INSERT INTO USERS (user_id, username, display_name, password
					, user_capabilities, user_role, cookie, blog_id, user_email, division) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
					[login.ID, @data.data.txtusername, login.data.display_name
					, @data.data.txtpassword, JSON.stringify(login.allcaps) , userRole
					, cookie, blog.blog_id, login.data.user_email, login.data.division])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)


		updateExistingUser : (userDetails)->

			login = userDetails.resp.login_details
			blog = userDetails.resp.blog_details
			cookie = userDetails.cookie
			userRole = userDetails.userRole

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, display_name=?, password=?
					, user_capabilities=?, user_role=?, cookie=?, blog_id=?, user_email=?
					, division=? WHERE user_id=?", 
					[@data.data.txtusername, login.data.display_name, @data.data.txtpassword
					JSON.stringify(login.allcaps), userRole, cookie, blog.blog_id
					, login.data.user_email, login.data.division, login.ID])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Updated user details'
			)



		offlineDeviceAuth : -> 

			existingUser = @isExistingUser(@data.txtusername)
			existingUser.done (user)=>
				if user.exists 
					if user.password is @data.txtpassword

						_.setUserID(user.userID)
						@setUserModelForOfflineLogin()
						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')       

				else @onErrorResponse('No such user has previously logged in')



		setUserModelForOfflineLogin : ->
			
			userDetails = _.getUserDetails(_.getUserID())
			userDetails.done (userDetails)=>

				_.setTblPrefix(userDetails.blog_id)

				user = App.request "get:user:model"

				data = 
					'ID': userDetails.user_id
					'division': userDetails.division
					'display_name': userDetails.username
					'user_email': userDetails.user_email


				user.set 'data' : data

				App.vent.trigger "show:dashboard"
				App.loginRegion.close()


		
		isExistingUser : (userName)->

			user = exists: false, userID: '', password: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT user_id, password FROM USERS WHERE username=?"
						, [userName], onSuccess(d), _.deferredErrorHandler(d))
			
			onSuccess = (d)->
				(tx, data)->

					if data.rows.length isnt 0

						row = data.rows.item(0)
						user = 
							exists: true
							userID: row['user_id']
							password: row['password']

					d.resolve(user)

			$.when(runQuery()).done ->
				console.log 'isExistingUser transaction completed'
			.fail _.failureHandler


		
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
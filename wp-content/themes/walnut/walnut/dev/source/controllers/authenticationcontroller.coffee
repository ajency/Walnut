define ["marionette","app", "underscore"], (Marionette, App, _) ->
	#Controls login authentication based on platform

	class AuthenticationController extends Marionette.Controller

		initialize : (options)->

			{@url, @data, @success} = options

			@platform = _.checkPlatform()

			@isOnline = _.isOnline()


		authenticate:->

			switch @platform
				when 'Desktop'
					if @isOnline
						@onlineWebAuth()
					else
						@onConnectionError()	

				when 'Mobile'
					if @isOfflineLoginEnabled()
						@offlineMobileAuth()
					
					else
						if @isOnline
							@onlineMobileAuth()
						else
							@onConnectionError()	


		# server login request for website
		onlineWebAuth:->
			$.post @url, data: @data, @success, 'json'


		# when network connection not available 
		onConnectionError:->
			response = 
				error : 'Connection could not be established. Please try again.'
			@success response


		# success response
		onSuccessResponse:->
			response = 
				success : true
			@success response


		# error response
		onErrorResponse:(msg)->
			response = 
				error : ''+msg
			@success response	


		# check if offline login is enabled
		isOfflineLoginEnabled:->
			if($('#offline').is(':checked'))
				true
			else false


		# server login request for mobile
		onlineMobileAuth:->
			$.post AJAXURL + '?action=get-user-app-profile', 
				   data: @data,
				   (resp)=>
				   		if resp.login_details.error
				   			@onErrorResponse(resp.login_details.error)	

				   		else
				   			# if the blog id is null, then the app is installed
				   			# for the first time.
				   			if _.getBlogID() is null
				   				@initialAppLogin(resp)
				   			else
				   				@authenticateUserBlogId(resp)
				   	,
				   	'json'	

		
		# offline login for mobile
		offlineMobileAuth:->
			user = @isExistingUser(@data.txtusername)
			user.done (d)=>
				if d.exists is true
					if d.password is @data.txtpassword
						@onSuccessResponse()

					else
						@onErrorResponse('Invalid Password')		

				else
					@onErrorResponse('No such user has previously logged in')


		# when the app is installed for the first time
		initialAppLogin:(server_resp)->
			resp = server_resp.blog_details
			# set blog id and blog name
			_.setBlogID(resp.blog_id)
			_.setBlogName(resp.blog_name)

			# download school logo
			_.downloadSchoolLogo("http://aditya.synapsedu.info/wp-content/uploads/sites/3/2014/05/images.jpg")

			@saveUpdateUserDetails(server_resp)
			@onSuccessResponse()

		
		# compare users blog id to that of the locally saved blog id
		authenticateUserBlogId:(server_resp)->
			resp = server_resp.blog_details

			if resp.blog_id isnt _.getBlogID()
				@onErrorResponse('The app is configured for school '+_.getBlogName())
			else
				@saveUpdateUserDetails(server_resp)
				@onSuccessResponse()


		# save new user or update existing user 
		saveUpdateUserDetails:(resp)->
			user = @isExistingUser(@data.txtusername)
			user.done (d)=>
				if d.exists is true
				   	@updateExistingUser(resp)
				else
				  	@inputNewUser(resp)


		# check if user exists in local database
		isExistingUser:(username)->
			data = 
				exists: false
				password: ''

			runQuery = ->
				$.Deferred (d)->
					_.db.transaction (tx)->
						tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d))

			onSuccess = (d)->
				(tx,data)->
					i=0
					while i < data.rows.length
						r = data.rows.item(i)
						if r['username'] is username
							data.exists = true
							data.password = r['password']
						i++
					d.resolve(data)

			$.when(runQuery()).done (data)->
				console.log 'isExistingUser transaction completed'
			.fail _.failureHandler

		
		# insert new user
		inputNewUser:(response)->
			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES (?, ?, ?, ?)', [resp.ID, @data.txtusername, @data.txtpassword, resp.roles[0]])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)


		# update existing user
		updateExistingUser:(response)->
			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", [@data.txtusername, @data.txtpassword, resp.ID])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Updated user details'
			)



 	# request handler
 	App.reqres.setHandler "get:auth:controller",(options)->
 		new AuthenticationController options



define ["marionette","app", "underscore"], (Marionette, App, _) ->
	#Controls login authentication based on platform

	class AuthenticationController extends Marionette.Controller

		initialize : (options)->

			{@url, @data, @success} = options

			@platform = _.platform()

			@isOnline = _.isOnline()


		authenticate:->

			switch @platform

				when 'BROWSER'
					if @isOnline then @onlineWebAuth()
					else @onConnectionError()	

				when 'DEVICE'
					if @isOfflineLoginEnabled() then @offlineMobileAuth()
					
					else 
						if @isOnline then @onlineMobileAuth()
						else @onConnectionError()	


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

			if($('#offline').is(':checked')) then true else false


		# server login request for mobile
		onlineMobileAuth:->

			$.post AJAXURL + '?action=get-user-app-profile', 
				   data: @data,
				   (resp)=>
				   		if resp.login_details.error
				   			@onErrorResponse(resp.login_details.error)	

				   		else
				   			# set user model for back button navigation
				   			@setUserModel()

				   			# if the blog id is null, then the app is installed
				   			# for the first time.
				   			if _.getBlogID() is null then @initialAppLogin(resp)
				   			else @authenticateUserBlogId(resp)
				   	,
				   	'json'	

		
		# offline login for mobile
		offlineMobileAuth:->

			offlineUser = _.getUserDetails(@data.txtusername)

			offlineUser.done (user)=>
				if user.exists
					if user.password is @data.txtpassword
						# set user model for back button navigation
						@setUserModel()

						@onSuccessResponse()

					else @onErrorResponse('Invalid Password')		

				else @onErrorResponse('No such user has previously logged in')


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

			offlineUser = _.getUserDetails(@data.txtusername)
			
			offlineUser.done (user)=>
				if user.exists then @updateExistingUser(resp)
				else @inputNewUser(resp)

		
		# insert new user
		inputNewUser:(response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES (?, ?, ?, ?)', 
					[resp.ID, @data.txtusername, @data.txtpassword, resp.roles[0]])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Inserted new user'
			)


		# update existing user
		updateExistingUser:(response)->

			resp = response.login_details

			_.db.transaction((tx)=>
				tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", 
					[@data.txtusername, @data.txtpassword, resp.ID])

			,_.transactionErrorhandler 
			,(tx)->
				console.log 'SUCCESS: Updated user details'
			)


		# set user model
		setUserModel: ->
			# user model is set to dummy data for back button navigation
			user = App.request "get:user:model"
			user.set 'ID' : '0'


 	# request handler
 	App.reqres.setHandler "get:auth:controller",(options)->
 		new AuthenticationController options


